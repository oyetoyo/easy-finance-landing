#!/bin/bash
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
echo
eval 'cat <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: merchants-landing-page-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      component: merchants-landing-page
  template:
    metadata:
      labels:
        component: merchants-landing-page
    spec:
      imagePullSecrets:
        - name: registry-leverinvl
      containers:
        - name: merchants-landing-page
          image: $IMAGE
          ports:
            - containerPort: 80

---
apiVersion: v1
kind: Service
metadata:
  name: merchants-landing-page-cluster-ip-service
spec:
  type: ClusterIP
  selector:
    component: merchants-landing-page
  ports:
    - port: 80
      targetPort: 80

EOF
' | kubectl apply -f -

