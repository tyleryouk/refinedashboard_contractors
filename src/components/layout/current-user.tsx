import { Popover, Button } from 'antd/lib'
import React from 'react'

// UI Toolkit from Ant Design

const CurrentUser = () => {
  return (
    <>
        <Popover
            placement='bottomRight'
            trigger="click"
            overlayInnerStyle={{padding: 0}}
            overlayStyle={{ zIndex: 999 }}
        >
            TEST

        </Popover>
    </>
  )
}

export default CurrentUser