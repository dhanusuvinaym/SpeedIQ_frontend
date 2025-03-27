import { notification } from 'antd';

export const openNotification = (message, placement, type) => {

    const config = {
        placement: placement,
        duration: 3,
        style: {
            display: 'flex',
            alignItems: 'center', // Align items vertically in the same line
            padding: "0",
            paddingTop: "0.2cm",
            paddingLeft: "0.2cm",
        },
    };

    notification[type]({
        ...config,
        message: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginLeft: '0.5rem', paddingRight: '20px', fontWeight: "500", fontSize: "15px" }}>{message}</span>
            </div>
        ),
    });

}
