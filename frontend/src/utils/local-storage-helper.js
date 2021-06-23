
/*
 * Method to set an item in local-storage
 * @param: key
 * @param: value
 * */
export function set( key, value ) {
    localStorage.setItem( key, value )
}

/*
 * Method to get an item from local-storage
 * @param: key
 * @param: defaultValue
 * */
export function get( key, defaultValue ) {
    return localStorage.getItem( key ) || defaultValue;
}

/*
 * Method to set an item(of type array) in local-storage
 * @param: key
 * @param: value
 * */
export function setArray( key, value ) {
    localStorage.setItem( key, JSON.stringify( value ) );
}

/*
 * Method to get an item(of type array) from local-storage
 * @param: key
 * */
export function getArray( key ) {
    if ( !localStorage.getItem( key ) ) {
        return JSON.parse( localStorage.getItem( key ) );
    } else {
        return [];
    }
}

/*
 * Method to set an item(of type Object) in local-storage
 * @param: key
 * @param: value
 * */
export function setObj( key, value ) {
    localStorage.setItem( key, JSON.stringify( value ) );
}

/*
 * Method to get an item(of type Object) in local-storage
 * @param: key
 * */
export function getObj( key ) {
    if ( localStorage.getItem( key ) ) {
        return JSON.parse( localStorage.getItem( key ) );
    } else {
        return undefined;
    }
}

/*
 * Method to remove specific data from local storage
 * @param: key
 * */
export function removeObj( key ) {
    if ( localStorage.getItem( key ) ) {
        localStorage.removeItem( key );
    }
}

/*
 * Method to remove all data from local storage
 * */
export function clearAllLocalStorage() {
    localStorage.clear();
}
