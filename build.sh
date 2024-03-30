#!/bin/bash

#部署環境 [讀取第一個參數]
BUILDENV=$1

#版本號碼 [讀取第二個參數]
VERSION=$2

TOKEN=$3

if [ -z "$BUILDENV" ]; then
    echo "用法: sh build.sh [Arg1] [Arg2]"
    echo "Arg1: Build版環境(local/dev/demo/prod)"
    echo "Arg2: 版本號碼"
    exit 0
fi

if [ -z "$VERSION" ]; then
    echo "\n沒有指定版本號碼"
    exit 0
fi

echo "\n建立image檔案..."
docker build -t daily-backup-cronjob .


if [ "$BUILDENV" != "local" ]; then
    # 將 Image 加上 tag
    echo "\n标记本地镜像"
    docker tag daily-backup-cronjob charlessin1993/daily-backup-cronjob:"$BUILDENV"_"$VERSION"

    # docker login docker.io
    cat DOCKER_HUB_TOKEN.txt | docker login --username charlessin1993 --password-stdin

    # 將 Image 推到 artifacts registry 上
    echo "\n上傳至 Docker Hub"
    docker push charlessin1993/daily-backup-cronjob:"$BUILDENV"_"$VERSION"

    # 部署
    echo "\n部署到 GKE 上"
    kubectl apply -f gke-resource/timezone-config.yaml
    kubectl apply -f gke-resource/second-config.yaml
    kubectl apply -f gke-resource/secret.yaml
    kubectl apply -f gke-resource/cronjob.yaml

    # 更新
    echo "\n更新 Docker Image"
    kubectl set image cronjob/daily-backup-cronjob cronjob-test=charlessin1993/daily-backup-cronjob:"$BUILDENV"_"$VERSION" --namespace=default

    # helm upgrade --install --create-namespace daily-backup app-helm --namespace test-cronjob --reuse-values -f helm_value/values.yaml --set job.image.repository=eugeneyiew128/daily-backup-cronjob:"$BUILDENV"_"$VERSION" --atomic

    docker rmi charlessin1993/daily-backup-cronjob:"$BUILDENV"_"$VERSION"
    docker rmi daily-backup-cronjob

    echo "\nAll Done!!"
fi
