import datetime
import hashlib
import os.path


def hash_md5(file):
    with open(file, 'rb') as f:
        data = f.read()
        md5 = hashlib.md5(data).hexdigest()
        return md5


# 遍历 images 下所有图片文件 重命名 md5.后缀
def rename():
    for root, dirs, files in os.walk('images'):
        for file in files:
            if file.endswith('.jpg') or file.endswith('.jpeg') or file.endswith('.png') or file.endswith('.webp'):
                file_path = os.path.join(root, file)
                md5 = hash_md5(file_path)
                file_name = md5 + os.path.splitext(file)[1]
                new_file_path = os.path.join("out_images", file_name)
                if os.path.exists(new_file_path):
                    # 如果存在，则在文件名字 .后缀前面 加上时间戳精确到毫秒
                    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S%f")
                    file_name = file_name.split('.')[0] + "_" + timestamp + '.' + file_name.split('.')[1]
                    new_file_path = os.path.join("out_images", file_name)
                # file_path move new_file_path
                os.rename(file_path, new_file_path)
                print(file_path, '======>', new_file_path)


rename()
