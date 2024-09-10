# Tema 5: Servicios manejados de Kubernetes

--- 

## Levantar un clúster de kubernetes y despliegue de una aplicación

--- 

*NO ejecutar esta parte*
`minikube start`
`alias kubectl="minikube kubectl --"`

*Verificar la versión instalada de kubectl*
`kubectl version --client`

// To install the AWS CLI, run the following commands.
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

aws configure

// Para instalar o actualizar kubectl en Linux (amd64)

curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.30.2/2024-07-12/bin/linux/amd64/kubectl
curl -O https://s3.us-west-2.amazonaws.com/amazon-eks/1.30.2/2024-07-12/bin/linux/amd64/kubectl.sha256
sha256sum -c kubectl.sha256
openssl sha1 -sha256 kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$HOME/bin:$PATH
echo 'export PATH=$HOME/bin:$PATH' >> ~/.bashrc

kubectl version --client




// Instalar eksctl
# for ARM systems, set ARCH to: `arm64`, `armv6` or `armv7`
ARCH=amd64
PLATFORM=$(uname -s)_$ARCH

curl -sLO "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_$PLATFORM.tar.gz"

# (Optional) Verify checksum
curl -sL "https://github.com/eksctl-io/eksctl/releases/latest/download/eksctl_checksums.txt" | grep $PLATFORM | sha256sum --check

tar -xzf eksctl_$PLATFORM.tar.gz -C /tmp && rm eksctl_$PLATFORM.tar.gz

sudo mv /tmp/eksctl /usr/local/bin


aws sts get-caller-identity

kubectl get svc


// Crear cluster en AWS
eksctl create cluster --name my-eks-cluster --region us-east-1 

kubectl get pods -A -o wide


// Configurar aws eks 
aws eks update-kubeconfig --region us-east-1 --name my-eks-cluster

eksctl delete cluster --name my-eks-cluster --region us-east-1


// Después de crear el YAML

// Cree un espacio de nombres de
kubectl create  namespace eks-sample-app

// Aplique el manifiesto de implementación al clúster.
kubectl apply -f  eks-sample-deployment.yaml

// Aplique el manifiesto de servicio al clúster.
kubectl apply -f eks-sample-service.yaml


// Consulte todos los recursos que existen en el espacio de nombres eks-sample-app.
kubectl get all -n eks-sample-app

// Consulte los detalles del servicio implementado. 
kubectl -n eks-sample-app describe service eks-sample-linux-service

// Se pueden consultar los detalles de los pods con la siguiente línea de código
kubectl -n eks-sample-app describe pod eks-sample-linux-deployment-74bbc7d7b6-4mqt8

//Ejecute un shell en el Pod que describió en el paso anterior
kubectl exec -it eks-sample-linux-deployment-74bbc7d7b6-4mqt8 -n eks-sample-app -- /bin/bash

// Desde el shell del Pod, vea la salida del servidor web que se instaló con la implementación en un paso anterior. 
curl eks-sample-linux-service

// Desde el shell del Pod, vea el servidor de DNS del Pod.
cat /etc/resolv.conf


eksctl delete cluster --name my-eks-cluster --region us-east-1
