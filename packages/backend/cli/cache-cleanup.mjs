import fs from 'fs';

function cleanup(path) {
  console.log(`🧹 正在清理 ${path} 下的文件...`);
  fs.rmSync
    ? fs.rmSync(path, { recursive: true, force: true })
    : fs.readdirSync(path).forEach((file) => {
        fs.unlinkSync(`${path}/${file}`);
      });
  console.log(`✅ ${path} 已清空！`);
}

cleanup('./storage/static');
cleanup('./storage/uploads');
