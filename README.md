# FlacConverterNodeJS
Convert Flac files to mp3

## Giới thiệu:
- Bài sẽ hướng dẫn Sử dụng NodeJS để code chương trình chuyển đổi file nhạc lossless .flac sang file .mp3 theo từng bước cơ bản.
- chuyển định dạng file flac trong thư mục đầu vào và in ra thư mục đầu ra theo đúng cấu trúc và chỉ chuyển file flac sang mp3,còn các file khác giữ nguyên.
- Chuyển định dạng file flac đơn sang một file mp3.
- Các thư viện phụ trợ:
    - ffmpeg dùng để chuyển đổi dạng file.
    - child-process để chạy terminal đổi dạng file thông qua ffmpeg
    - read-chunk và file-type để đọc định dạng file (.flac) để tránh các file 'trap' như text nhưng đuôi flac.
- Kết quả có được sau khi convert:

![Input](./images/intro_input.png)
![Ouput](./images/intro_output.png)