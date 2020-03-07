[ ! -d "./veniqa-s3-backup" ] && echo git clone https://github.com/smaharj1/veniqa-s3-backup.git

cd veniqa-s3-backup

S3_BUCKET="veniqa-catalog-images"
S3_BUCKET_PATH="/veniqa-catalog-images"

function s3Upload
{
  path=$1
  # file=$2
  echo "Path $path"

  bucket=${S3_BUCKET}
  bucket_path=${S3_BUCKET_PATH}

  contentLength=`cat $path | wc -c`

  # echo "Content length $contentLength"
  date=$(date +"%a, %d %b %Y %T %z")
  content_type="$(file -b --mime-type "$path")" 

  curl -X PUT -T "$path" \
    -H "Host: http://localhost:3000" \
    -H "Date: $date" \
    -H "Content-Length: $contentLength" \
    -H "Content-Type: $content_type" \
    "http://localhost:3000$bucket_path/$path"
}

# # set the path based on the first argument
path=$1

curl --request PUT http://localhost:3000/${S3_BUCKET}

find $path | while read fname; do
  if ! [ -d "$fname" ] && ! [[ $fname == *".git"* ]]; then
    s3Upload "$fname"
    # echo "$fname"
  fi
done

