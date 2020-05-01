export CLOUDSDK_CORE_DISABLE_PROMPTS=1
export CLOUDSDK_CORE_PROJECT=long-nomad-162522
export CLOUDSDK_COMPUTE_ZONE=us-central1-a
export DOCKER_TAG_PREFIX="gcr.io/$CLOUDSDK_CORE_PROJECT/pagedip/"

#CLUSTER is the kubernetes cluster to deploy to
#STAGE is the google storage pagedip-deploy folder to reference for deployment files
if [ "$TRAVIS_BRANCH" = "master" ]; then
  export DIST_TAG=latest
  export CLUSTER=shared-1
  export STAGE=prod
else
  export DIST_TAG=edge
  export CLUSTER=dev-1
  export STAGE=staging
fi

source $(cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd)/gcloud-setup.sh
