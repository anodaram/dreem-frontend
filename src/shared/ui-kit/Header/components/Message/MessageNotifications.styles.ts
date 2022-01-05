import { makeStyles } from "@material-ui/core/styles";

export const messageNotificationsStyles = makeStyles({
  message_notifications: {
    minWidth: 350,
  },
  message_notifications_header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15
  },
  edit_icon: {
    cursor: 'pointer'
  },
  item_list: {
    marginTop: 30,
    cursor: 'pointer',
    '& .item': {
        marginTop: 10,
        marginBottom: 10,
        display: 'flex'
    },
    '& .avatar-container': {
        borderRadius: '50%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        filter: 'drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.2))',
        width: 54,
        height: 54,
        marginRight: 20,
    },
    '& .avatar-container .avatar': {
        width: 48,
        height: 48,
        borderRadius: '50%'
    },
    '& .item-content': {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start'
    },
    '& .item-content .name': {
        marginBottom: 3,
        color: '#181818',
        fontSize: 14,
    },
    '& .item-content .message': {
        marginBottom: 3,
        color: '#949BAB',
        fontSize: 14,
    },
    '& .item-content .date': {
        marginBottom: 3,
        color: '#949BAB',
        fontSize: 11,
    }
  },
  message_notifications_footer: {
    paddingTop: 20,
    paddingBottom: 5,
    borderTop: '0.5px solid #99A1B3',
    textAlign: 'center',
    color: '#99A1B3',
    cursor: 'pointer'
  }
});
