from fastapi import HTTPException , status


SUPPORTED_FILE_TYPE_FOR_UPLOADCARE={
    
    'image/png' : 'png',
    'image/jpeg' : 'jpeg' ,
    "image/jpeg":"jpg"  
}



EXTENSIONS_SUPPORTED_FOR_UPLOADCARE=[
    "png" , "jpeg" , "jpg", "webp", "gif"
]

SUPPORTED_FILE_TYPE_FOR_ASSETS={
    'video/mp4' : 'mp4',
    'video/quicktime':'mov'        
} 

SUPPORTED_FILE_LIST_FOR_ASSETS=[
    "mp4","mov"
]
SUPPORTED_EXTENSIONS=[
    "stl" , "obj" , "fbx" , "dae" , "glb" , "gltf" ,"stp" , "license" 
    ]

SUPPORTED_EXTENSION_FOR_TIER_ASSETS=[
     "glb" , "gltf" , "mp4", "mov" ,"stl"
] 

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate credentials",
    
)


SUPPORTED_ASSETS_FOR_UPLOADING_S3=[
    "stl" , "obj" , "fbx" , "dae" , "glb" , "gltf" ,"stp" , "license" ,'mp4',
    'mov'        
    
]

REQUIRED_FIELDS_FOR_MODEL = [
    "modelName" , "description" , "modelFileUrl" ,"modelImages" ,"category" , "price" 
]
