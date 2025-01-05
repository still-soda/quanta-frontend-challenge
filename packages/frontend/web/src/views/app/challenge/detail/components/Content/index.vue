<template>
   <div class="pl-4 pr-6 flex gap-7 flex-col">
      <header class="flex justify-between items-center">
         <div class="text-[2rem] font-semibold">1. Easy CSS Button</div>
         <div class="flex gap-2">
            <Tag type="info" class="bg-[#3281FF] py-[0.25rem]">CSS</Tag>
            <Tag type="info" class="bg-[#3281FF] py-[0.25rem]">CSS</Tag>
         </div>
      </header>
      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Book />
            <div class="text-[1.5rem] font-semibold">题目描述</div>
         </div>
         <div class="pl-7 -mb-4">
            <Markdown :raw-content="detailContent" />
         </div>
      </div>

      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Image />
            <div class="text-[1.5rem] font-semibold">示例图片</div>
         </div>
         <div class="flex gap-5 pl-7">
            <img
               class="h-[9.8125rem] w-fit rounded-sm"
               src="https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg"
               alt="" />
            <img
               class="h-[9.8125rem] w-fit rounded-sm"
               src="https://pic1.zhimg.com/v2-a622d09f99ce9292cb35db0707be587a_r.jpg"
               alt="" />
         </div>
      </div>

      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <CloudDown />
            <div class="text-[1.5rem] font-semibold">附件下载</div>
         </div>
         <div class="flex flex-col gap-3 pl-7">
            <div
               class="flex gap-2 items-center px-[1.56rem] py-5 rounded-outside shadow-inside">
               <CodeFile />
               <div>
                  <div class="font-semibold">index.html</div>
                  <div class="text-gray-500 tracking-tighter">1.25 KB</div>
               </div>
               <div
                  class="p-[0.62rem] aspect-square rounded-xl bg-orange-high hover:bg-orange-low transition-colors text-white ml-auto hover:cursor-pointer">
                  <Download />
               </div>
            </div>
         </div>
      </div>

      <div class="flex flex-col gap-3">
         <div class="flex gap-1.5 items-center">
            <Upload />
            <div class="text-[1.5rem] font-semibold">上传答案</div>
         </div>
         <div class="flex flex-col gap-3 pl-7">
            <Uploader accept="text/html" :max-file-counts="3" />
         </div>
      </div>

      <div>
         <Button class="w-fit ml-auto py-1.5" type="primary">提交答案</Button>
      </div>
   </div>
</template>

<script setup lang="ts">
import { Tag, Button, Uploader, Markdown } from '@/components';
import {
   Book,
   Image,
   CloudDown,
   Upload,
   CodeFile,
   Download,
} from '@/components/Icons';

const detailContent = `
### 这是最简单的 CSS 任务。

请完成一个 HTML + CSS 功能，当用户点击按钮 button 后，应在页面的 #output 标签中显示文字 “Hello world”。要求如下：

1. 文字初始颜色为 红色 \`（#ff0000）\`。
2. 显示后 1秒 文字颜色自动变为 绿色 \`（#00ff00）\`。
`;
</script>
