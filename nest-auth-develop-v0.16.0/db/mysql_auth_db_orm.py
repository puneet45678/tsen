from sqlalchemy import create_engine, and_, func
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import Table, MetaData, String, Column
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, String, DateTime, Integer
from datetime import datetime, timedelta

from config import read_yaml
from logger.logging import get_logger
logger = get_logger(__name__)


Base = declarative_base()


# class IkarusNestAdditionalSessionInfo(Base):
#     __tablename__ = 'ikarus_nest_additional_session_info'
    
#     external_user_id = Column(String(45))
#     session_handle = Column(String(36), primary_key=True)
#     sec_ch_ua = Column(String(128))
#     sec_ch_ua_mobile = Column(String(255))
#     sec_ch_ua_platform = Column(String(255))
#     Sec_Fetch_Dest = Column(String(255))
#     Sec_Fetch_Mode = Column(String(255))
#     Sec_Fetch_Site = Column(String(255))
#     User_Agent = Column(String(255))
#     client_ip = Column(String(255))
#     device = Column(String(255))
#     browser = Column(String(255))
#     location = Column(String(255))
    


class UserDeviceMapping(Base):
    __tablename__ = 'User_device_mapping'
    
    user_id = Column(String(255), primary_key=True)
    fingerprint_id = Column(String(255), primary_key=True)


class Permission(Base):
    __tablename__ = 'permissions'
    
    permission = Column(String(255), primary_key=True)


class EmailChangeToken(Base):
    __tablename__ = 'Email_change_tokens'

    user_id = Column(Integer, primary_key=True)
    new_email = Column(String(255), nullable=False)
    token = Column(String(255), nullable=False)
    token_expiry = Column(DateTime, nullable=False, default=func.now())

class PasswordChangeToken(Base):
    __tablename__ = 'Password_change_tokens'

    user_id = Column(Integer, primary_key=True)
    token = Column(String(255), nullable=False)
    token_expiry = Column(DateTime, nullable=False, default=func.now())

#TODO: We are connecting to db everytime which is inefficient and costly operation. We should use connection pooling.

def connect_to_database():
    try:
        engine = create_engine(f'mysql+pymysql://{read_yaml.mysql_username}:{read_yaml.mysql_password}@{read_yaml.mysql_host}:{read_yaml.mysql_port}/{read_yaml.mysql_auth_custom_db}')
        Session = sessionmaker(bind=engine)
        return Session
    except SQLAlchemyError as error:
        logger.error(f"Error connecting to database: {error}")
        return None



def create_table_if_not_existed():
    engine = create_engine(f'mysql+pymysql://{read_yaml.mysql_username}:{read_yaml.mysql_password}@{read_yaml.mysql_host}:{read_yaml.mysql_port}/{read_yaml.mysql_auth_custom_db}')
    # Base.metadata.create_all(engine)



# def insert_session_info(vals):
#     Session = connect_to_database()

#     if Session is None:
#         logger.error("Could not establish connection to database.")
#         return

#     try:
#         with Session() as session:
#             session_info = IkarusNestAdditionalSessionInfo(
#                 external_user_id=vals[0], 
#                 session_handle=vals[1], 
#                 sec_ch_ua=vals[2], 
#                 sec_ch_ua_mobile=vals[3], 
#                 sec_ch_ua_platform=vals[4], 
#                 Sec_Fetch_Dest=vals[5], 
#                 Sec_Fetch_Mode=vals[6], 
#                 Sec_Fetch_Site=vals[7], 
#                 User_Agent=vals[8], 
#                 client_ip=vals[9],
#                 device = vals[10],
#                 browser = vals[11],
#                 location = vals[12]

#             )
#             session.add(session_info)
#             session.commit()
#             logger.info("SessionInfo inserted successfully")
#     except SQLAlchemyError as error:
#         logger.error(f"Error occurred while inserting session info: {error}")
#         raise



# def get_session_info_from_user_id(user_id):
#     Session = connect_to_database()
#     if Session is None:
#         logger.error("Could not establish connection to database.")
#         return
#     try:
#         with Session() as session:
#             session = session.query(IkarusNestAdditionalSessionInfo).filter_by(external_user_id=user_id).all()
#             return session
        
#     except SQLAlchemyError as error:
#         logger.error(f"Error occurred while inserting token: {error}")
#         raise

# def get_session_info_from_session_id(session_id):
#     Session = connect_to_database()
#     if Session is None:
#         logger.error("Could not establish connection to database.")
#         return
#     try:
#         with Session() as session:
#             session = session.query(IkarusNestAdditionalSessionInfo).filter_by(session_handle=session_id).first()
#             return session
        
#     except SQLAlchemyError as error:
#         logger.error(f"Error occurred while inserting token: {error}")
#         raise



# def delete_session(sessionHandle):
#     Session = connect_to_database()

#     if Session is None:
#         logger.error("Could not establish connection to database.")
#         return

#     try:
#         with Session() as session:
#             session_info = session.query(IkarusNestAdditionalSessionInfo).filter(IkarusNestAdditionalSessionInfo.session_handle == sessionHandle).one()
#             session.delete(session_info)
#             session.commit()
#             logger.info("SessionInfo deleted successfully")
#     except SQLAlchemyError as error:
#         logger.error(f"Error occurred while deleting session info: {error}")
#         raise



# def delete_session_for_user(userDbId):
#     Session = connect_to_database()

#     if Session is None:
#         logger.error("Could not establish connection to database.")
#         return

#     try:
#         with Session() as session:
#             session_info = session.query(IkarusNestAdditionalSessionInfo).filter(IkarusNestAdditionalSessionInfo.external_user_id == userDbId).all()
#             for info in session_info:
#                 session.delete(info)
#             session.commit()
#             logger.info("Sessions deleted successfully")
#     except SQLAlchemyError as error:
#         logger.error(f"Error occurred while deleting session info: {error}")
#         raise



def map_fingerprint_with_userid(user_id, device_fingerprint):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return

    create_table_if_not_existed()

    try:
        with Session() as session:
            existing_mapping = session.query(UserDeviceMapping).filter(
                UserDeviceMapping.user_id == user_id,
                UserDeviceMapping.fingerprint_id == device_fingerprint).one_or_none()

            if existing_mapping is not None:
                logger.debug("User ID and Device Fingerprint pair already exists.")
                raise Exception("User ID and Device Fingerprint pair already exists.")

            mapping = UserDeviceMapping(user_id=user_id, fingerprint_id=device_fingerprint)
            session.add(mapping)
            session.commit()

            logger.debug("Fingerprint inserted")
            return "Inserted"
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting User-Device mapping: {error}")
        raise




def check_if_fingerprint_present(user_id, device_fingerprint):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return False
    try:
        with Session() as session:
            existing_mapping = session.query(UserDeviceMapping).filter(
                UserDeviceMapping.user_id == user_id,
                UserDeviceMapping.fingerprint_id == device_fingerprint).one_or_none()
            return existing_mapping is not None
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while checking User-Device mapping: {error}")
        return False


def add_email_verification_token_to_db(user_id,new_email, token, expiry_in_hours):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return

    # create_table_if_not_existed()

    try:
        with Session() as session:
            existing_token = session.query(EmailChangeToken).filter(
                and_(EmailChangeToken.user_id == user_id, EmailChangeToken.token_expiry > datetime.now())).one_or_none()

            if existing_token is not None:
                logger.debug("Unexpired token for user already exists.")
                # return existing_token.token
                raise Exception("Unexpired token for user already exists.")

            token_entry = EmailChangeToken(user_id=user_id, new_email=new_email, token=token, token_expiry=datetime.now() + timedelta(hours=int(expiry_in_hours)))
            session.add(token_entry)
            session.commit()

            logger.debug("Token inserted")
            return token
        
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting token: {error}")
        raise


def add_password_change_token_to_db(user_id,token,expiry_in_hours):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return

    # create_table_if_not_existed()

    try:
        with Session() as session:
            existing_token = session.query(PasswordChangeToken).filter(
                and_(PasswordChangeToken.user_id == user_id, PasswordChangeToken.token_expiry > datetime.now())).one_or_none()

            if existing_token is not None:
                logger.debug("Unexpired token for user already exists.")
                raise Exception("Unexpired token for user already exists.")

            token_entry = PasswordChangeToken(user_id=user_id, token=token, token_expiry=datetime.now() + timedelta(hours=expiry_in_hours))
            session.add(token_entry)
            session.commit()

            logger.debug("Token inserted")
            return "Inserted"
        
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting token: {error}")
        raise



def get_token_from_db(token,user_id):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return
    try:
        with Session() as session:
            token_in_db = session.query(EmailChangeToken).filter_by(token=token, user_id=user_id).first()
            return token_in_db
        
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting token: {error}")
        raise

def check_if_token_exists(user_id,new_email):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return False
    try:
        with Session() as session:
            token_in_db = session.query(EmailChangeToken).filter_by(user_id=user_id, new_email=new_email).first()
            return token_in_db
        
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting token: {error}")
        return False


def get_token_from_password_db(token,user_id):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return
    try:
        with Session() as session:
            token_in_db = session.query(PasswordChangeToken).filter_by(token=token, user_id=user_id).first()
            return token_in_db
        
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while inserting token: {error}")
        raise


def delete_token_from_db(token_in_db):
    Session = connect_to_database()
    if Session is None:
        logger.error("Could not establish connection to database.")
        return
    try:
        with Session() as session:
            session.delete(token_in_db)
            session.commit()
            logger.info("Token deleted successfully")
    except SQLAlchemyError as error:
        logger.error(f"Error occurred while deleting token: {error}")
        raise
