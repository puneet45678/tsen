# import rsa as r
# from Crypto.Cipher import AES
# from Crypto import Random
# import hashlib
# import time
# import sys
# import os
# from Crypto.Hash import SHA256
# from tkinter import *
# from tkinter import messagebox
# import glob
# import getpass
# import datetime
# import threading
# time.clock = time.time

# #TODO: File path settings

# def triggerEncrypt(passw):
#         ############################### ENCRYPTION LOGIC #####################################################
#     # filename = "temp.stl"
#     chunksize = 64*1024
#     fileList = glob.glob("**/*.stl", recursive=True)
#     filename = fileList[0][8:]
#     outputfile = "(enc)" + filename
#     path = f"api/tmp/{filename}"
#     filesize = str(os.path.getsize(path)).zfill(16)
#     IV = Random.new().read(16) ##initialization vector to generate new and random encrypted data
#     key = SHA256.new(passw.encode('utf-8')).digest()
#     encrypter = AES.new(key, AES.MODE_CBC,IV)

#     ## rb== read in binary || wb == write in binary
#     with open(path, 'rb') as in_file:
#         with open(outputfile, 'wb') as out_file:
#             out_file.write(filesize.encode('utf-8'))
#             out_file.write(IV)

#             while True:
#                 chunk = in_file.read(chunksize)

#                 if len(chunk)==0:
#                     break
#                 elif len(chunk)%16 !=0:
#                     chunk += b' '*(16-(len(chunk)%16))
        
#                 out_file.write(encrypter.encrypt(chunk))
#     ######################################################################################################

# def trigger():
#     triggerEncrypt()
    
# def read_encryption():
#     with open("(enc)temp.stl","rb") as f:
#         new_contents = f.read()
#     return new_contents
