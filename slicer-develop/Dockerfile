FROM python:3.11.1

WORKDIR  /app

COPY requirements.txt .

RUN pip install -r requirements.txt

RUN apt update

COPY  . .

ARG mongo_user_name
ENV mongo_user_name=${mongo_user_name}

ARG mongo_pass_word
ENV mongo_pass_word=${mongo_pass_word}

ARG mongmongodb_uri
ENV mongodb_uri=${mongodb_uri}

ARG aws_access_key_id
ENV aws_access_key_id=${aws_access_key_id}

ARG aws_secret_access_key
ENV aws_secret_access_key=${aws_secret_access_key}

ARG ec2_instance_id
ENV ec2_instance_id=${ec2_instance_id}

ARG supertokens_core_api_key
ENV supertokens_core_api_key=${supertokens_core_api_key}

CMD ["python", "run.py" , "--env=production"]

