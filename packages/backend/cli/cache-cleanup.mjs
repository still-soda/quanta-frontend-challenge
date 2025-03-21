import fs from 'fs';

function cleanup(path) {
  console.log(`🧹 正在清理 ${path} 下的文件...`);
  fs.readdir(path, (err, files) => {
    err && console.error(`❌ 清理发生错误：${err}`);
    files.forEach((file) => {
      fs.unlinkSync(`${path}/${file}`);
    });
  });
  console.log(`✅ ${path} 已清空！`);
}

cleanup('./storage/static');
cleanup('./storage/uploads');
