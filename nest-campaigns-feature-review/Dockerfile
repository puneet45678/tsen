FROM python:3.11.1

WORKDIR /code

COPY ./requirements.txt /code/requirements.txt

RUN pip install --upgrade pip

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . /code
ARG uploadcare_public_key
ARG uploadcare_secret_key

ENV MY_APP_ENV=development

ENV UPLOADCARE__UPLOADCARE_PUBLIC_KEY=${uploadcare_public_key}
ENV UPLOADCARE__UPLOADCARE_SECRET_KEY=${uploadcare_secret_key}

ARG aws_access_key_id
ARG aws_secret_access_key

ENV AWS__AWS_ACCESS_KEY_ID=${aws_access_key_id}
ENV AWS__AWS_SECRET_ACCESS_KEY=${aws_secret_access_key}

ARG mongo_username
ARG mongo_password

ENV MONGODB__USERNAME=${mongo_username}
ENV MONGODB__PASSWORD=${mongo_password}

ARG super_tokens_core_api_key

ENV SUPERTOKENS__CONNECTION_URI=http://15.207.107.101:3567/
ENV SUPERTOKENS__API_KEY=${super_tokens_core_api_key}

EXPOSE 8002

CMD ["python", "run.py"]