import os
import argparse
from uvicorn import run
from multiprocessing import freeze_support


def main():
    parser = argparse.ArgumentParser(description='Start the FastAPI app with a specific environment.')
    parser.add_argument('--env', type=str, required=False)
    print("args",parser.parse_args())

    args = parser.parse_args()
    if args.env:
        env = args.env
        os.environ['APPLICATION_ENV']=env
    else:
        env = 'local'
        os.environ['APPLICATION_ENV'] = env

    config_file = f"{env}_application.yaml"
    os.environ['MY_APP_CONFIG_FILE'] = config_file

    if env == 'local':reload = True
    else: reload = False
    # Run Uvicorn programmatically with your FastAPI app
    run("main:app", host="0.0.0.0", port=8004, reload=reload)

if __name__ == '__main__':
    freeze_support()
    main()