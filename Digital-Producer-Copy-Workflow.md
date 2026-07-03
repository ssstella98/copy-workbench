# Digital Producer Copy Workflow

## Problem Statement:

今天digital product team在项目的文案管理方面仍然非常原始，这严重block digital producer后期整理和维护文案的工作效率：

- pm确认项目scope并产出需求EPIC和user flow
- designer根据需求和user flow产出UI/UX设计图
- 开发by每个sprint根据设计图和更detailed的user story来画页面，并按照前期producer设置好的一套key value规则来规定页面上每个文案位置对应的key值（目前有一个excel\+宏的工具能够帮助开发快速根据规则来生成key，但是这首先需要producer人工对设计图进行整理，例如把页面按照product booth/product option/checkout来区分层级）
- 在项目即将完成所有开发工作后，开发将key值根据页面导出（通常是以excel的形式，各个项目组有不同的格式和习惯），然后
- producer review人工将设计图与key值整理成一个copy文档，并在文档中填充中英文双语版的copy
- producer和pm以及业务方一起review copy
- producer给法务和公关部门送审copy，通过后邮件发送给日文native speaker翻译日文版内容
- 最终将finalized内容整理并填充成excel文件，给到开发转成JSON文件，并导入到项目中

## Importance of Solving the Problem Now:

- 痛点1：整理页面、生成key值是很混乱的一件事
    - 生成key值虽然有一套固定的规则，但仍然需要producer人工整理层级和UI图上的点位，前期投入的工作量很大
    - 对key值的规划几乎完全由各个studio的开发自行解决，他们有各自的工作习惯
    - 开发给到producer文档的时间过晚，通常在项目开发接近完成时才做knowledge transferring，给到producer写copy的时间不多了（因为pm是by sprint出具体需求的，这过程中一直会对key值不断有增删改）
- 痛点2：内容的产出效率也很低
    - 现在已经在用AI写文案，但是是by场景一条一条和AI对话并产出草稿的
    - 各个项目各自运行，彼此之间可能有一些通用的terminology，但是不同的producer并不知道，还是要通过人工检索的方式去写
    - （nice to have）只要文案内容相同，即使是在不同的页面上，也希望能够指向同一个key，现在只能by项目维度尽量做到这一点

## Product Requirements:

- 从项目的工作流角度，提前介入key design：希望能有一个统一的文案编辑/管理平台？
    - 所有producer共用同一个工作台，多人并行项目互不干扰，同时有完整的修改历史
    - 工作台具体需求：
        - 在Design Review meeting通过后，producer可以直接上传figma UI稿，自动/半自动识别页面上的文案占位符
        - 根据文案占位，自动按照规则生成待填写的key值列表，可修改，实时校验格式
        - 可按固定格式导出成excel/doc文档，无需再人工整理
    - AI辅助起稿 \+ 文案资产库
        - 支持把历史上已经approved的文案按类型、场景、功能模块归档，producer在写新项目时可以先检索库里是否有可复用或可参考的文案
        - 自动根据pm给的草稿自动出初版文案，producer只负责润色和review
        - 提供预设的文案场景和检查机制：新增字段时，producer选择文案类型后，系统根据类型自动展示场景checklist，例如选择"Error"类型，系统会提示：*是否覆盖以下场景？空输入 / 格式错误 / 超出限制*

## Risks:

- 能否有权限直接读取figma red line
- 和开发的合作流程需要重新设计

## Target Audience:

- Digital Producer
- Digital Engineering Team
- Digital Producer Manager

## Cadence

- 利用历史项目模拟跑出一套工作流
- 在新的项目中试点
- 和DE沟通具体的工作节奏和合作模式
- 大规模推广

## Metrics

- 项目文案交付周期：每个producer在项目上的投入时长缩短50%
- 字段命名规范合规率：100%
- 审核一次通过率：90%

