const  extractDeviceName = (fullName)=> {
    return fullName?.split('/').pop();
}

export {extractDeviceName}