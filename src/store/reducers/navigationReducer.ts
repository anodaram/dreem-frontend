const INIT_STATE = {
	containerClassnames: "menu-default",
	subHiddenBreakpoint: 1440,
	menuHiddenBreakpoint: 768,
	menuClickCount: 1,
	selectedMenuHasSubItems: true //if you use menu-sub-hidden as default menu type, set value of this variable to false
};

const navigationReducer = (state = INIT_STATE, action) => {
	switch (action.type) { 

        case "MENU_CHANGE_HAS_SUB_ITEM_STATUS":
            return{
                ...state,
                selectedMenuHasSubItems: action.payload
            }

		case "MENU_CONTAINER_ADD_CLASSNAME":
            return {
                ...state,
                containerClassnames: action.payload
            }
        
		case "MENU_CHANGE_DEFAULT_CLASSES":
			return  {
                ...state,
				containerClassnames: action.payload
			}

		case "MENU_SET_CLASSNAMES":
            return {
                ...state,
                containerClassnames: action.payload.containerClassnames,
                menuClickCount:action.payload.menuClickCount
            }

		case "MENU_CLICK_MOBILE_MENU":
            return {
                ...state,
                containerClassnames: action.payload.containerClassnames,
                menuClickCount:action.payload.menuClickCount
            }
		default: return { ...state };
	}
}

export default navigationReducer
