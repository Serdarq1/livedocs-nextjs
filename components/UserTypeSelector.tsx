import React from 'react'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const UserTypeSelector = ({ userType, setUserType, onClickHandler }: UserTypeSelectorParams ) => {
    const accessChangeHandler = (type: UserType) => {
        setUserType(type);
        onClickHandler && onClickHandler(type);
    };
  
    return (
    <Select value={userType} onValueChange={(type: UserType) => accessChangeHandler(type)}>
      <SelectTrigger className="shad-select">
        <SelectValue/>
      </SelectTrigger>
      <SelectContent className='border-none bg-dark-200'>
        <SelectGroup>
          <SelectItem value='viewer' className='shad-select-item'>can view</SelectItem>
          <SelectItem value='editor' className='shad-select-item'>can edit</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default UserTypeSelector