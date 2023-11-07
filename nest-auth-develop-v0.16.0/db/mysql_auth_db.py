
#The functions in this file are replaced by the functions in myql_auth_db_orm.py
#It is optional to use this file. It is kept here for reference purpose only.



import mysql.connector as connector
from config import read_yaml

from logger.logging import get_logger
logger = get_logger(__name__)


def connect_to_database():
    try:
        connection = connector.connect(host=read_yaml.mysql_host,port =read_yaml.mysql_port ,database=read_yaml.mysql_auth_custom_db, user=read_yaml.mysql_username,password=read_yaml.mysql_password)
        return connection
    except connector.Error as error:
        logger.error(f"Error connecting to database: {error}")
        return None


def insert_session_info(vals):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
    cursor=None
    try:
        cursor = connection.cursor()
        query = f"INSERT INTO ikarus_nest_additional_session_info VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
        cursor.execute(query,vals)
        connection.commit()
        cursor.close()
        connection.close()
        logger.info("SessionInfo inserted")
    except connector.Error as error:
        logger.error("Error: {}".format(error))
    finally:
        if cursor:
            cursor.close()
            connection.close()


def delete_session(sessionHandle):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
    cursor = None
    try:
        cursor = connection.cursor()
        query = f"DELETE FROM ikarus_nest_additional_session_info WHERE session_handle = %s ;"
        try:
            cursor.execute(query,(sessionHandle,))
        except Exception as e:
            raise Exception(e)
        
        connection.commit()
        cursor.close()
        connection.close()
        logger.info("SessionInfo deleted")

    except connector.Error as error:
        logger.error("Error: {}".format(error))
        raise Exception(error)
    finally:
        if cursor:
            cursor.close()
            connection.close()


def delete_session_for_user(userDbId):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
    cursor = None
    try:
        cursor = connection.cursor()
        query = f"DELETE FROM ikarus_nest_additional_session_info WHERE external_user_id = %s ;"
        try:
            cursor.execute(query, (userDbId,))
        except Exception as e:
            raise Exception(e)
        
        connection.commit()
        cursor.close()
        connection.close()
        logger.info("Sessions deleted")
    except connector.Error as error:
        logger.error("Error: {}".format(error))
        raise Exception(error)
    finally:
        if cursor:
            cursor.close()
            connection.close()


def create_table_if_not_existed(connection):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
    cursor = None
    try:
        cursor = connection.cursor()
        query1 = '''CREATE TABLE IF NOT EXISTS User_device_mapping (
        user_id varchar(255) NOT NULL,
        fingerprint_id varchar(255) NOT NULL,
        PRIMARY KEY (user_id, fingerprint_id));'''
        cursor.execute(query1)
        connection.commit()
        cursor.close()
    except connector.Error as error:
        logger.error("Error: {}".format(error))
    finally:
        if cursor:
            cursor.close()
            connection.close()
    


def map_fingerprint_with_userid(user_id, device_fingerprint):
    vals = (user_id, device_fingerprint)
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return
    create_table_if_not_existed(connection)
    try:
        cursor = connection.cursor()
        # check if pair is already in the database
        check_query = "SELECT * FROM User_device_mapping WHERE user_id = %s AND fingerprint_id = %s;"
        cursor.execute(check_query, vals)
        result = cursor.fetchone()
        
        # if the pair exists, print a message and return
        if result is not None:
            logger.debug("User ID and Device Fingerprint pair already exists.")
            raise Exception("User ID and Device Fingerprint pair already exists.")
        
        # if not, insert the pair into the database
        insert_query = "INSERT INTO User_device_mapping VALUES (%s, %s);"
        cursor.execute(insert_query, vals)
        connection.commit()

        logger.debug("Fingerprint inserted")
        return "Inserted"
    except connector.Error as error:
        logger.error("Error: {}".format(error))
        raise Exception(error)
    finally:
        cursor.close()
        connection.close()


def check_if_fingerprint_present(user_id, device_fingerprint):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return False

    cursor = None
    try:
        cursor = connection.cursor()
        query = "SELECT * FROM User_device_mapping WHERE user_id = %s AND fingerprint_id = %s ;"  
        cursor.execute(query, (user_id, device_fingerprint))
        result = cursor.fetchone()
        if result:
            return True
        else:
            return False
    except connector.Error as error:
        logger.error("Error while executing query: ", error)
        return False
    finally:
        if cursor:
            cursor.close()
        connection.close()

def add_permissions_to_db(permissions):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return
    cursor = None
    try:
        cursor = connection.cursor()
        query = """ CREATE TABLE IF NOT EXISTS permissions (permission VARCHAR(255),UNIQUE(permission))"""
        cursor.execute(query)
        for permission in permissions:
        # Try to insert the permission, ignore if it already exists
            sql = "INSERT IGNORE INTO permissions (permission) VALUES (%s)"
            val = (permission, )
            cursor.execute(sql, val)
        connection.commit()
        logger.debug(f"Permissions added to the database {permissions}")
    except connector.Error as error:
        logger.error("Error while executing query: ", error)
        raise Exception(error)
    finally:
        if cursor:
            cursor.close()
        connection.close()


def create_email_change_tokens_table_if_not_existed(connection):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
    cursor = None
    try:
        cursor = connection.cursor()
        query1 = '''CREATE TABLE IF NOT EXISTS Email_change_tokens (
        token varchar(255) NOT NULL,
        new_email varchar(255) NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP);'''

        cursor.execute(query1)
        connection.commit()
        cursor.close()
    except connector.Error as error:
        logger.error("Error: {}".format(error))
    finally:
        if cursor:
            cursor.close()
            connection.close()


def insert_verification_token(email,token):
    vals = (token, email)
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return
    create_table_if_not_existed(connection)
    try:
        cursor = connection.cursor()
        # check if pair is already in the database
        check_query = "SELECT * FROM Email_change_tokens WHERE user_id = %s AND fingerprint_id = %s;"
        cursor.execute(check_query, vals)
        result = cursor.fetchone()
        
        # if the pair exists, print a message and return
        if result is not None:
            logger.debug("User ID and Device Fingerprint pair already exists.")
            raise Exception("User ID and Device Fingerprint pair already exists.")
        
        # if not, insert the pair into the database
        insert_query = "INSERT INTO User_device_mapping VALUES (%s, %s);"
        cursor.execute(insert_query, vals)
        connection.commit()

        logger.debug("Fingerprint inserted")
        return "Inserted"
    except connector.Error as error:
        logger.error("Error: {}".format(error))
        raise Exception(error)
    finally:
        cursor.close()
        connection.close()







