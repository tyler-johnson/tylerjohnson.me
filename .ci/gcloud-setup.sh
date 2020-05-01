export CLOUDSDK_CORE_DISABLE_PROMPTS=1

if [ -z "$GCLOUD_KEY" ]; then
  >&2 echo "Missing GCLOUD_KEY"
  exit 1
fi

# remove whatever version was installed with a package manager
if [ -d "/usr/lib/google-cloud-sdk" ]; then
  sudo rm -rf "/usr/lib/google-cloud-sdk"
fi

if [ ! -d "$HOME/google-cloud-sdk/bin" ]; then
  rm -rf "$HOME/google-cloud-sdk"
  curl https://sdk.cloud.google.com | bash > /dev/null
fi

source "$HOME/google-cloud-sdk/path.bash.inc"
gcloud version
gcloud --quiet components update

# authenticate
echo $GCLOUD_KEY | base64 --decode > gcloud.json
gcloud auth activate-service-account $GCLOUD_EMAIL --key-file gcloud.json
ssh-keygen -f ~/.ssh/google_compute_engine -N ""

# install kubectl and configure docker
gcloud --quiet components update kubectl
gcloud auth configure-docker
