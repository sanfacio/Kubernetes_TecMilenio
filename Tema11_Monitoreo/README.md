Para realizar una demostración práctica sobre el uso de herramientas de monitoreo en un entorno de DevOps, te recomiendo utilizar una combinación de herramientas de monitoreo de código abierto como **Prometheus** y **Grafana**, junto con una aplicación web sencilla para simular una carga de trabajo que puedas monitorear. A continuación, te doy los pasos para implementar la demo y ejecutarla en un taller práctico.

---
### 1. Herramientas de Monitoreo

- **Prometheus**: Herramienta de monitoreo y alertas para recopilar métricas de tu aplicación.
- **Grafana**: Plataforma para visualizar los datos que recopila Prometheus.
- **Node Exporter**: Exportador de métricas de hardware y del sistema para Prometheus.
- **cAdvisor**: Herramienta de monitoreo de contenedores Docker que puede integrarse con Prometheus.
- **Flask o Node.js**: Aplicación de prueba para generar tráfico y consumo de recursos.
---
### 2. Pasos para Configurar el Entorno de Monitoreo en Docker

#### a. Instalar Docker

Primero, asegúrate de que Docker esté instalado en tu máquina.

		sudo apt update
		sudo apt install docker.io -y
		sudo systemctl start docker
		sudo systemctl enable docker


#### b. Crear la Red Docker para los Contenedores

Para que los contenedores puedan comunicarse entre sí:


		docker network create monitoring

#### c. Configurar Prometheus

1. Crear el archivo **`prometheus.yml`** para configurar **Prometheus**:
######
2. Crear el contenedor de **Prometheus**:

		docker run -d \
		  --name=prometheus \
		  --network=monitoring \
		  -p 9090:9090 \
		  -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml \
		  prom/prometheus

3. Una vez que **Prometheus** esté corriendo, accede a la interfaz de usuario a través de `http://localhost:9090`

#### d. Configurar Grafana

1. Crear el contenedor de **Grafana**:
   
		docker run -d \
		   --name=grafana \
		   --network=monitoring \
		   -p 3000:3000 \
		   grafana/grafana
   
2. Una vez que **Grafana** esté corriendo, accede a la interfaz de usuario a través de `http://localhost:3000`. Las credenciales por defecto son `admin/admin`. Configura **Prometheus** como una fuente de datos en **Grafana**:
   
	- Ir a "Configuration" → "Data Sources" → "Add data source".
	- Seleccionar "Prometheus" e ingresar `http://prometheus:9090` como URL.

#### e. Configurar Node Exporter

1. Crear el contenedor de **Node Exporter**:

		docker run -d \
		  --name=node-exporter \
		  --network=monitoring \
		  -p 9100:9100 \
		  prom/node-exporter
2. Una vez que **Node Exporter** esté corriendo, accede a la interfaz de usuario a través de `http://localhost:9100`

#### f. Configurar cAdvisor

1. Crear el contenedor de **cAdvisor**:

		docker run -d \
		  --name=cadvisor \
		  --network=monitoring \
		  -p 8080:8080 \
		  --volume=/:/rootfs:ro \
		  --volume=/var/run:/var/run:rw \
		  --volume=/sys:/sys:ro \
		  --volume=/var/lib/docker/:/var/lib/docker:ro \
		  google/cadvisor

2. Una vez que **cAdvisor** esté corriendo, accede a la interfaz de usuario a través de `http://localhost:8080`

---
### 3. Aplicación de Muestra para el Monitoreo


Vamos a utilizar una aplicación web sencilla en **Node.js** o **Flask** para generar tráfico y monitorearla.

#### Opción 1: Aplicación en **Flask**

1. Crear la carpeta FlaskApp

		mkdir FlaskApp

2. Entrar a la carpeta FlaskApp

		cd FlaskApp

3. Crear el archivo `app.py`:
######
4. Dockerfile para **Flask**:

		FROM python:3.9-slim
		WORKDIR /app
		COPY requirements.txt .
		RUN pip install -r requirements.txt
		COPY . .
		CMD ["python", "app.py"]

5. Crear el contenedor:

		docker build -t flask-app .
		docker run -d --name=flask-app --network=monitoring -p 5000:5000 flask-app

6. Una vez que la aplicación está en ejecución, entrar a la aplicación desde `http://localhost:5000`

#### Opción 2: Aplicación en **Node.js**

1. Crear la carpeta NodeApp

		mkdir NodeApp

2. Entrar a la carpeta NodeApp

		cd NodeApp

3. Crear el archivo `app.js`:
######
4. Dockerfile para **Node.js**:

		FROM node:14
		WORKDIR /app
		COPY package*.json ./
		RUN npm install
		COPY . .
		CMD ["node", "app.js"]

5. Crear el contenedor:

		docker build -t node-app .
		docker run -d --name=node-app --network=monitoring -p 3100:3100 node-app

6. Una vez que la aplicación está en ejecución, entrar a la aplicación desde `http://localhost:3100`
---

#### Opción 3: Aplicación de creación de mensajes en **Flask**

1. Crear la carpeta FlaskMessaging

		mkdir FlaskMessaging

2. Entrar a la carpeta FlaskMessaging

		cd FlaskMessaging

3. Crear el archivo `app.py`:
######
4. Dockerfile para **Flask**:

		FROM python:3.10-slim
		WORKDIR /app
		COPY . /app
		RUN pip install --no-cache-dir -r requirements.txt
		EXPOSE 5100
		CMD ["python", "app.py"]

5. Crear el contenedor:

		docker build -t flask-message-app .
		docker run -d --name=flask-message-app --network=monitoring -p 5100:5100 flask-message-app

6. Una vez que la aplicación está en ejecución, entrar a la aplicación desde `http://localhost:5100/messages`
---

### 4. Monitorear la Aplicación

Una vez que la aplicación esté corriendo, puedes ver las métricas en *Prometheus* y *Grafana*. Aquí te indico algunos pasos para generar logs y tráfico:

1. Acceder a la aplicación varias veces desde tu navegador para generar tráfico:

    
    - Para Flask: `http://localhost:5000`
    - Para Node.js: `http://localhost:3100`
    - Para mensajes en Flask: `http://localhost:5100/messages`

2. Visualizar los logs de la aplicación en el contenedor

		docker logs flask-app   # Para la aplicación Flask
		docker logs node-app    # Para la aplicación Node.js

---
#### Referencias
[Overview | Prometheus](https://prometheus.io/docs/introduction/overview/)

[Technical documentation | Grafana Labs](https://grafana.com/docs/)

[Monitoring Linux host metrics with the Node Exporter | Prometheus](https://prometheus.io/docs/guides/node-exporter/)

[Monitoring Docker container metrics using cAdvisor | Prometheus](https://prometheus.io/docs/guides/cadvisor/)


