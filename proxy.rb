#!/usr/bin/env ruby
# Local dev server: static files + Hunyuan API proxy (CORS bypass)
# macOS comes with Ruby built-in. No installation needed.
# Usage: ruby proxy.rb

require 'webrick'
require 'webrick/httpproxy'
require 'net/http'
require 'uri'
require 'json'

PORT = 8080
HUNYUAN_HOST = 'api.hunyuan.cloud.tencent.com'

server = WEBrick::HTTPServer.new(
  Port: PORT,
  DocumentRoot: File.dirname(__FILE__),
  Logger: WEBrick::Log.new($stdout, WEBrick::Log::INFO),
  AccessLog: [[File.open('/dev/null', 'w'), WEBrick::AccessLog::COMMON_LOG_FORMAT]]
)

# API proxy endpoint
server.mount_proc '/api/hunyuan' do |req, res|
  # Handle CORS preflight
  if req.request_method == 'OPTIONS'
    res.status = 204
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    next
  end

  target_path = req.path.sub('/api/hunyuan', '')
  target_url = "https://#{HUNYUAN_HOST}#{target_path}"

  begin
    uri = URI(target_url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 30
    http.read_timeout = 60

    request = Net::HTTP::Post.new(uri.path)
    # Forward headers
    %w[Content-Type Authorization].each do |h|
      val = req.header[h]
      request[h] = val.first if val
    end
    request.body = req.body

    response = http.request(request)

    res.status = response.code.to_i
    res['Content-Type'] = response['Content-Type'] || 'application/json'
    res['Access-Control-Allow-Origin'] = '*'
    res['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
    res['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'
    res.body = response.body
  rescue => e
    res.status = 502
    res['Access-Control-Allow-Origin'] = '*'
    res.body = JSON.generate(error: "Proxy error: #{e.message}")
  end
end

trap('INT') { server.shutdown }
puts "Producer Copy Workbench → http://localhost:#{PORT}/figma-key-demo.html"
puts "API proxy: /api/hunyuan/* → https://#{HUNYUAN_HOST}/*"
server.start
