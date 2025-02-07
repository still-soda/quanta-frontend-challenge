/// 这个文件定义了一些常见的 MIME 类型，用于标识文件的类型。
/// 包括了 application、audio、image、text、video 和 multipart 等类型。
/// @author: still-soda

export type ApplicationMimeType =
  | 'application/atom+xml'
  | 'application/ecmascript'
  | 'application/json'
  | 'application/javascript'
  | 'application/octet-stream'
  | 'application/ogg'
  | 'application/pdf'
  | 'application/postscript'
  | 'application/soap+xml'
  | 'application/font-woff'
  | 'application/xhtml+xml'
  | 'application/xml-dtd'
  | 'application/xop+xml'
  | 'application/zip'
  | 'application/gzip'
  | 'application/graphql'
  | 'application/ld+json'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/vnd.oasis.opendocument.text'
  | 'application/vnd.oasis.opendocument.spreadsheet'
  | 'application/vnd.oasis.opendocument.presentation'
  | 'application/vnd.oasis.opendocument.graphics'
  | 'application/vnd.google-earth.kml+xml'
  | 'application/vnd.google-earth.kmz'
  | 'application/vnd.amazon.ebook'
  | 'application/x-www-form-urlencoded'
  | 'application/x-dvi'
  | 'application/x-latex'
  | 'application/x-font-ttf'
  | 'application/x-shockwave-flash'
  | 'application/x-stuffit'
  | 'application/x-rar-compressed'
  | 'application/x-tar'
  | 'application/x-www-form-urlencoded'
  | 'application/x-7z-compressed';

export type AudioMimeType =
  | 'audio/basic'
  | 'audio/L24'
  | 'audio/mp4'
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/vorbis'
  | 'audio/vnd.rn-realaudio'
  | 'audio/vnd.wave'
  | 'audio/webm';

export type ImageMimeType =
  | 'image/gif'
  | 'image/jpeg'
  | 'image/pjpeg'
  | 'image/png'
  | 'image/svg+xml'
  | 'image/tiff'
  | 'image/vnd.microsoft.icon'
  | 'image/vnd.wap.wbmp'
  | 'image/webp';

export type TextMimeType =
  | 'text/css'
  | 'text/csv'
  | 'text/html'
  | 'text/javascript'
  | 'text/plain'
  | 'text/xml'
  | 'text/markdown';

export type VideoMimeType =
  | 'video/mpeg'
  | 'video/mp4'
  | 'video/ogg'
  | 'video/quicktime'
  | 'video/webm'
  | 'video/x-matroska'
  | 'video/x-ms-wmv'
  | 'video/x-flv'
  | 'video/3gpp'
  | 'video/3gpp2';

export type MultipartMimeType =
  | 'multipart/mixed'
  | 'multipart/alternative'
  | 'multipart/related'
  | 'multipart/form-data'
  | 'multipart/signed'
  | 'multipart/encrypted';

export type MimeType =
  | ApplicationMimeType
  | AudioMimeType
  | ImageMimeType
  | TextMimeType
  | VideoMimeType
  | MultipartMimeType;
