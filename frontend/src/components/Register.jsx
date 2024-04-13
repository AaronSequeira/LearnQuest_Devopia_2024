import React, { useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox, Input, Link} from "@nextui-org/react";
import {Select, SelectSection, SelectItem} from "@nextui-org/react";
import {MailIcon} from '../assets';
import {LockIcon} from '../assets';
import axios from "axios";
import {NameIcon} from '../assets';
import {ToastContainer, toast} from 'react-toastify';
import Login from "./Modal";

export default function App({handleChange , onClose, setFormType, error}) {
   const roles = [
    {label: "Student", value: "Student"},
    {label: "Teacher", value: "Teacher"},
  ]

  const grades = [
    { label: "KG", value: "KG" },
    { label: "1", value: "1" },
    { label: "2", value: "2" },
    { label: "3", value: "3" },
    { label: "4", value: "4" },
    { label: "5", value: "5" },
    { label: "6", value: "6" },
    { label: "7", value: "7" },
    { label: "8", value: "8" },
    { label: "9", value: "9" },
    { label: "10", value: "10" },
    { label: "11", value: "11" },
    { label: "12", value: "12" },
  ]

  return (
    <>
      <Input
        isClearable
        autoFocus
        endContent={<NameIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>}
        label="Name"
        placeholder="Enter your name"
        variant="bordered"
        color="success"
        onChange={(e) => {handleChange('name',e)}}
      />

      <Input
        isClearable
        endContent={
          <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Email"
        placeholder="Enter your email"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        variant="bordered"

        onChange={(e) => {handleChange('email',e)}}
      />
      <Input
        endContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        onChange={(e) => {handleChange('pwd',e)}}
      />

      <Input
        endContent={
          <LockIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        label="Confirm Password"
        placeholder="Enter your password"
        type="password"
        variant="bordered"
        isInvalid={error ? true : false}
        color={error ? 'danger' : 'success'}
        onChange={(e) => {handleChange('cpwd',e)}}
      />

      <Select
        isRequired
        label="Role"
        placeholder="Choose your role"
        className="max-w-xs"
        onChange={(e) => handleChange('role', e)}
      >
        {roles.map((role) => (
          <SelectItem key={role.value} value={role.value}>
            {role.label}
          </SelectItem>
        ))}
      </Select>

      <Select
        isRequired
        label="Grade"
        placeholder="Choose your Grade"
        className="max-w-xs"
        onChange={(e) => handleChange('grade', e)}
      >
        {grades.map((grade) => (
          <SelectItem key={grade.value} value={grade.value}>
            {grade.label}
          </SelectItem>
        ))}
      </Select>

      <div className="flex py-2 px-1 justify-between">
        <Checkbox
          classNames={{
            label: "text-small",
          }}
        >
          Remember me
        </Checkbox>
        <Link color="primary" href="#" size="sm" onPress={()=>setFormType("Login")} >
          Already have an Account?
        </Link>
      </div>
    </>
  );
}