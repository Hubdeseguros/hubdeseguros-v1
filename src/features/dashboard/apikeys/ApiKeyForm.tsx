import React from "react"
import { useForm } from "react-hook-form"
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ApiKey } from "./mockApiKeys"

type ApiKeyFormProps = {
  initialData?: ApiKey
  onSubmit: (data: Omit<ApiKey, "id" | "key" | "createdAt">) => void
  onCancel: ()
} 