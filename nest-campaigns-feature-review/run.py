import os
import argparse
from uvicorn import run
from multiprocessing import freeze_support

def main():
    parser = argparse.ArgumentParser(description='Start the FastAPI app with a specific environment.')
    parser.add_argument('--env', type=str, required=False)


    args = parser.parse_args()
    if args.env:
        env = args.env
        print("Env",env)
        os.environ['MY_APP_ENV']=env
    else:
        env = 'local'
        os.environ['MY_APP_ENV'] = env

    config_file = f"{env}_application.yaml"
    os.environ['MY_APP_CONFIG_FILE'] = config_file

    if env in ['local','development']:reload = True
    else: reload = False
    # Run Uvicorn programmatically with your FastAPI app
    run("index:app", host="0.0.0.0", port=8002, reload=reload)

if __name__ == '__main__':
    freeze_support()
    main()