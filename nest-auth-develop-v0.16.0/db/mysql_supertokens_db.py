import mysql.connector as connector
from config import read_yaml
from logger.logging import get_logger

logger = get_logger(__name__)

connection = connector.connect(host=read_yaml.mysql_host,database=read_yaml.mysql_db, user=read_yaml.mysql_username,password=read_yaml.mysql_password,port = read_yaml.mysql_port)


def connect_to_database():
    try:
        connection = connector.connect(host=read_yaml.mysql_host,port =read_yaml.mysql_port ,database=read_yaml.mysql_db, user=read_yaml.mysql_username,password=read_yaml.mysql_password)
        return connection
    except connector.Error as error:
        print(f"Error connecting to database: {error}")
        return None



def get_session_info(userDbId):
    connection = connect_to_database()
    if connection is None:
        print("Could not establish connection to database.")
        raise Exception("Could not establish connection to database.")
    cursor =None
    try:
        cursor = connection.cursor()
        logger.info("Calling Function for getting session info")
        query = f"Select * from ikarus_nest_session_info where user_id = %s ;"
        try:
            cursor.execute(query,(userDbId,))
            res = cursor.fetchall()     
        except Exception as e:
            raise Exception(e)
        return res
    
    except connector.Error as error:
        print("Error while executing query: ", error)
        raise Exception("Error while executing query: ", error)
    
    
    finally:
        if cursor:
            print("CLosing mapping cursor")
            cursor.close()
        connection.close()





async def check_verified_emails(userDbId):
    connection = connect_to_database()
    if connection is None:
        print("Could not establish connection to database.")
        raise Exception("Could not establish connection to database.")
    
    cursor = None
    logger.info(f"Calling Function for verifying emails for id;{userDbId}")
    try:
        cursor = connection.cursor()
        query = f"SELECT user_id from ikarus_nest_emailverification_verified_emails WHERE user_id = %s;"
        
        try:
            cursor.execute(query, (userDbId,))
            res = cursor.fetchall()
        except Exception as e:
            raise Exception(e)
        return res
    
    except connector.Error as error:
        print("Error while executing query: ", error)
        raise Exception("Error while executing query: ", error)
    
    finally:
        if cursor:
            cursor.close()
        connection.close()



def get_permissions_for_role(role):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return None
    cursor = None
    try:
        cursor = connection.cursor()
        query = """
            SELECT rp.permission
            FROM ikarus_nest_role_permissions AS rp
            WHERE rp.role = %s
        """
        cursor.execute(query, (role,))
        result = cursor.fetchall()
        return list(set([permission[0] for permission in result])) # return list of permissions
    
    except connector.Error as error:
        logger.error("Error while executing query: ", error)
        return None
    finally:
        if cursor:
            cursor.close()
        connection.close()


def get_all_roles_with_permissions():
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        raise Exception("Could not establish connection to database.")
    cursor = None
    try:
        cursor = connection.cursor()

        # Fetch all distinct roles
        query_roles = "SELECT DISTINCT role FROM ikarus_nest_roles"
        cursor.execute(query_roles)
        roles = [role[0] for role in cursor.fetchall()]

        # Fetch permissions for each role
        role_permissions = {}
        for role in roles:
            query_permissions = "SELECT permission FROM ikarus_nest_role_permissions WHERE role = %s"
            cursor.execute(query_permissions, (role,))
            permissions = [permission[0] for permission in cursor.fetchall()]
            role_permissions[role] = permissions
        return roles, role_permissions
    
    except connector.Error as error:
        logger.error(f"Error while executing query: ", error)
        raise Exception(error)
    finally:
        if cursor:
            cursor.close()
        connection.close()

def get_admin_user_details(role, permissions):
    connection = connect_to_database()
    if connection is None:
        logger.error("Could not establish connection to database.")
        return []
    cursor = None
    try:
        cursor = connection.cursor()
        query_users = """SELECT ur.user_id, ev.email 
                         FROM ikarus_nest_user_roles ur
                         JOIN ikarus_nest_emailverification_verified_emails ev
                         ON ur.user_id = ev.user_id
                         WHERE ur.role = %s"""
        cursor.execute(query_users, (role,))
        users = cursor.fetchall()
        result = []
        for user in users:
            result.append({"user_id": user[0], "email": user[1], "roles": [{"role": role, "permissions": permissions}]})
        return result
    except connector.Error as error:
        logger.error("Error while executing query: ", error)
        raise Exception(error)
    finally:
        if cursor:
            cursor.close()
        connection.close()





async def check_if_email_present_in_custom_db(email):
    connection = connect_to_database()
    if connection is None:
        print("Could not establish connection to database.")
        raise Exception("Could not establish connection to database.")
    
    cursor = None
    logger.info(f"Calling Function for verifying emails for id;{email}")
    try:
        cursor = connection.cursor()
        query = f"SELECT user_id from ikarus_nest_emailpassword_users WHERE email = %s;"
        
        try:
            cursor.execute(query, (email,))
            res = cursor.fetchone()
        except Exception as e:
            raise Exception(e)
        
        # If res is not None, that means a record was found
        # So, return True
        if res:
            return True

        # If res is None, that means no record was found
        # So, return False
        return False
    
    except connector.Error as error:
        print("Error while executing query: ", error)
        raise Exception("Error while executing query: ", error)
    
    finally:
        if cursor:
            cursor.close()
        connection.close()


async def check_email_exists_in_db(email):
    connection = connect_to_database()
    if connection is None:
        print("Could not establish connection to database.")
        raise Exception("Could not establish connection to database.")
    
    cursor = None
    logger.info(f"Calling Function for checking if email exists;{email}")
    try:
        cursor = connection.cursor()

        # Query for checking in `ikarus_nest_emailpassword_users` table
        query1 = f"SELECT user_id from ikarus_nest_emailpassword_users WHERE email = %s;"
        
        # Query for checking in `ikarus_nest_thirdparty_users` table
        query2 = f"SELECT user_id from ikarus_nest_thirdparty_users WHERE email = %s;"
        
        try:
            # Execute query1 and fetch result
            cursor.execute(query1, (email,))
            res1 = cursor.fetchone()

            # Execute query2 and fetch result
            cursor.execute(query2, (email,))
            res2 = cursor.fetchone()

        except Exception as e:
            raise Exception(e)
        
        # If res1 or res2 is not None, that means a record was found
        # So, return True
        if res1 or res2:
            print(res1, res2)
            return True

        # If both res1 and res2 are None, that means no record was found
        # So, return False
        return False
    
    except connector.Error as error:
        print("Error while executing query: ", error)
        raise Exception("Error while executing query: ", error)
    
    finally:
        if cursor:
            cursor.close()
        connection.close()









