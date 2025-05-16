export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      actividades: {
        Row: {
          agente_id: string | null
          cliente_id: string | null
          created_at: string | null
          descripcion: string | null
          estado: Database["public"]["Enums"]["estado_actividad_enum"] | null
          fecha_actividad: string
          fecha_seguimiento: string | null
          id: string
          resultado: string | null
          seguimiento_requerido: boolean | null
          tipo: Database["public"]["Enums"]["tipo_actividad_enum"] | null
          updated_at: string | null
        }
        Insert: {
          agente_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_actividad_enum"] | null
          fecha_actividad: string
          fecha_seguimiento?: string | null
          id?: string
          resultado?: string | null
          seguimiento_requerido?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_actividad_enum"] | null
          updated_at?: string | null
        }
        Update: {
          agente_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: Database["public"]["Enums"]["estado_actividad_enum"] | null
          fecha_actividad?: string
          fecha_seguimiento?: string | null
          id?: string
          resultado?: string | null
          seguimiento_requerido?: boolean | null
          tipo?: Database["public"]["Enums"]["tipo_actividad_enum"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actividades_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "actividades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      agents: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          license_number: string
          phone: string | null
          status: Database["public"]["Enums"]["agent_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          license_number: string
          phone?: string | null
          status: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          license_number?: string
          phone?: string | null
          status?: Database["public"]["Enums"]["agent_status"]
          updated_at?: string
        }
        Relationships: []
      }
      aseguradoras: {
        Row: {
          codigo: string | null
          comision_base: number | null
          created_at: string | null
          direccion: string | null
          email: string | null
          estado: boolean | null
          id: string
          nombre: string
          persona_contacto: string | null
          telefono: string | null
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          comision_base?: number | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado?: boolean | null
          id?: string
          nombre: string
          persona_contacto?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          comision_base?: number | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado?: boolean | null
          id?: string
          nombre?: string
          persona_contacto?: string | null
          telefono?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      clientes: {
        Row: {
          agente_id: string | null
          apellido: string | null
          created_at: string | null
          direccion: string | null
          email: string | null
          estado: boolean | null
          estado_civil: Database["public"]["Enums"]["estado_civil_enum"] | null
          fecha_nacimiento: string | null
          genero: Database["public"]["Enums"]["genero_enum"] | null
          id: string
          metadata: Json | null
          nombre: string
          numero_documento: string
          ocupacion: string | null
          razon_social: string | null
          telefono: string | null
          tipo_documento: Database["public"]["Enums"]["tipo_documento_enum"]
          updated_at: string | null
        }
        Insert: {
          agente_id?: string | null
          apellido?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado?: boolean | null
          estado_civil?: Database["public"]["Enums"]["estado_civil_enum"] | null
          fecha_nacimiento?: string | null
          genero?: Database["public"]["Enums"]["genero_enum"] | null
          id?: string
          metadata?: Json | null
          nombre: string
          numero_documento: string
          ocupacion?: string | null
          razon_social?: string | null
          telefono?: string | null
          tipo_documento: Database["public"]["Enums"]["tipo_documento_enum"]
          updated_at?: string | null
        }
        Update: {
          agente_id?: string | null
          apellido?: string | null
          created_at?: string | null
          direccion?: string | null
          email?: string | null
          estado?: boolean | null
          estado_civil?: Database["public"]["Enums"]["estado_civil_enum"] | null
          fecha_nacimiento?: string | null
          genero?: Database["public"]["Enums"]["genero_enum"] | null
          id?: string
          metadata?: Json | null
          nombre?: string
          numero_documento?: string
          ocupacion?: string | null
          razon_social?: string | null
          telefono?: string | null
          tipo_documento?: Database["public"]["Enums"]["tipo_documento_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      oportunidades: {
        Row: {
          agente_id: string | null
          cliente_id: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_oportunidad_enum"] | null
          fecha_cierre_estimada: string | null
          id: string
          motivo_perdida: string | null
          probabilidad: number | null
          producto_id: string | null
          updated_at: string | null
          valor_potencial: number | null
        }
        Insert: {
          agente_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_oportunidad_enum"] | null
          fecha_cierre_estimada?: string | null
          id?: string
          motivo_perdida?: string | null
          probabilidad?: number | null
          producto_id?: string | null
          updated_at?: string | null
          valor_potencial?: number | null
        }
        Update: {
          agente_id?: string | null
          cliente_id?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_oportunidad_enum"] | null
          fecha_cierre_estimada?: string | null
          id?: string
          motivo_perdida?: string | null
          probabilidad?: number | null
          producto_id?: string | null
          updated_at?: string | null
          valor_potencial?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "oportunidades_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oportunidades_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          comprobante_numero: string | null
          created_at: string | null
          estado: Database["public"]["Enums"]["estado_pago_enum"] | null
          fecha_pago: string
          id: string
          metodo_pago: Database["public"]["Enums"]["metodo_pago_enum"] | null
          monto: number
          poliza_id: string | null
          updated_at: string | null
        }
        Insert: {
          comprobante_numero?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_pago_enum"] | null
          fecha_pago: string
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago_enum"] | null
          monto: number
          poliza_id?: string | null
          updated_at?: string | null
        }
        Update: {
          comprobante_numero?: string | null
          created_at?: string | null
          estado?: Database["public"]["Enums"]["estado_pago_enum"] | null
          fecha_pago?: string
          id?: string
          metodo_pago?: Database["public"]["Enums"]["metodo_pago_enum"] | null
          monto?: number
          poliza_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pagos_poliza_id_fkey"
            columns: ["poliza_id"]
            isOneToOne: false
            referencedRelation: "polizas"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          code: string
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          provider: Database["public"]["Enums"]["payment_provider"]
          updated_at: string | null
        }
        Insert: {
          code: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          provider: Database["public"]["Enums"]["payment_provider"]
          updated_at?: string | null
        }
        Update: {
          code?: string
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          provider?: Database["public"]["Enums"]["payment_provider"]
          updated_at?: string | null
        }
        Relationships: []
      }
      payment_notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          next_retry_at: string | null
          recipient: string
          retry_count: number | null
          sent_at: string | null
          status: Database["public"]["Enums"]["notification_status"]
          transaction_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          next_retry_at?: string | null
          recipient: string
          retry_count?: number | null
          sent_at?: string | null
          status: Database["public"]["Enums"]["notification_status"]
          transaction_id?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          next_retry_at?: string | null
          recipient?: string
          retry_count?: number | null
          sent_at?: string | null
          status?: Database["public"]["Enums"]["notification_status"]
          transaction_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_notifications_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "payment_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_settings: {
        Row: {
          api_key_production: string | null
          api_key_test: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_production: boolean | null
          provider: string
          updated_at: string | null
          webhook_secret: string | null
        }
        Insert: {
          api_key_production?: string | null
          api_key_test?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_production?: boolean | null
          provider: string
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Update: {
          api_key_production?: string | null
          api_key_test?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_production?: boolean | null
          provider?: string
          updated_at?: string | null
          webhook_secret?: string | null
        }
        Relationships: []
      }
      payment_transactions: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string | null
          currency: string | null
          error_message: string | null
          id: string
          payment_details: Json | null
          payment_method_id: string | null
          poliza_id: string | null
          provider_transaction_id: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          error_message?: string | null
          id?: string
          payment_details?: Json | null
          payment_method_id?: string | null
          poliza_id?: string | null
          provider_transaction_id?: string | null
          status: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string | null
          currency?: string | null
          error_message?: string | null
          id?: string
          payment_details?: Json | null
          payment_method_id?: string | null
          poliza_id?: string | null
          provider_transaction_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_transactions_poliza_id_fkey"
            columns: ["poliza_id"]
            isOneToOne: false
            referencedRelation: "polizas"
            referencedColumns: ["id"]
          },
        ]
      }
      polizas: {
        Row: {
          agente_id: string | null
          beneficiarios: Json | null
          cliente_id: string | null
          comision_porcentaje: number | null
          created_at: string | null
          documentos: Json | null
          estado: Database["public"]["Enums"]["estado_poliza_enum"] | null
          fecha_fin: string
          fecha_inicio: string
          forma_pago: Database["public"]["Enums"]["forma_pago_enum"] | null
          id: string
          metadata: Json | null
          numero_poliza: string
          prima_total: number | null
          producto_id: string | null
          updated_at: string | null
        }
        Insert: {
          agente_id?: string | null
          beneficiarios?: Json | null
          cliente_id?: string | null
          comision_porcentaje?: number | null
          created_at?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_poliza_enum"] | null
          fecha_fin: string
          fecha_inicio: string
          forma_pago?: Database["public"]["Enums"]["forma_pago_enum"] | null
          id?: string
          metadata?: Json | null
          numero_poliza: string
          prima_total?: number | null
          producto_id?: string | null
          updated_at?: string | null
        }
        Update: {
          agente_id?: string | null
          beneficiarios?: Json | null
          cliente_id?: string | null
          comision_porcentaje?: number | null
          created_at?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_poliza_enum"] | null
          fecha_fin?: string
          fecha_inicio?: string
          forma_pago?: Database["public"]["Enums"]["forma_pago_enum"] | null
          id?: string
          metadata?: Json | null
          numero_poliza?: string
          prima_total?: number | null
          producto_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "polizas_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polizas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "polizas_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          aseguradora_id: string | null
          coberturas: Json | null
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          estado: boolean | null
          id: string
          moneda: Database["public"]["Enums"]["moneda_enum"] | null
          nombre: string
          precio_base: number | null
          ramo_id: string | null
          requisitos: Json | null
          updated_at: string | null
        }
        Insert: {
          aseguradora_id?: string | null
          coberturas?: Json | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: boolean | null
          id?: string
          moneda?: Database["public"]["Enums"]["moneda_enum"] | null
          nombre: string
          precio_base?: number | null
          ramo_id?: string | null
          requisitos?: Json | null
          updated_at?: string | null
        }
        Update: {
          aseguradora_id?: string | null
          coberturas?: Json | null
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: boolean | null
          id?: string
          moneda?: Database["public"]["Enums"]["moneda_enum"] | null
          nombre?: string
          precio_base?: number | null
          ramo_id?: string | null
          requisitos?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "productos_aseguradora_id_fkey"
            columns: ["aseguradora_id"]
            isOneToOne: false
            referencedRelation: "aseguradoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "productos_ramo_id_fkey"
            columns: ["ramo_id"]
            isOneToOne: false
            referencedRelation: "ramos"
            referencedColumns: ["id"]
          },
        ]
      }
      ramos: {
        Row: {
          codigo: string | null
          created_at: string | null
          descripcion: string | null
          estado: boolean | null
          id: string
          nombre: string
          updated_at: string | null
        }
        Insert: {
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: boolean | null
          id?: string
          nombre: string
          updated_at?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string | null
          descripcion?: string | null
          estado?: boolean | null
          id?: string
          nombre?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string | null
          descripcion: string | null
          id: string
          nombre: string
          permisos: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre: string
          permisos?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          id?: string
          nombre?: string
          permisos?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      siniestros: {
        Row: {
          created_at: string | null
          descripcion: string | null
          documentos: Json | null
          estado: Database["public"]["Enums"]["estado_siniestro_enum"] | null
          fecha_reporte: string
          fecha_siniestro: string
          id: string
          lugar: string | null
          monto_aprobado: number | null
          monto_reclamado: number | null
          numero_siniestro: string
          observaciones: string | null
          poliza_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_siniestro_enum"] | null
          fecha_reporte: string
          fecha_siniestro: string
          id?: string
          lugar?: string | null
          monto_aprobado?: number | null
          monto_reclamado?: number | null
          numero_siniestro: string
          observaciones?: string | null
          poliza_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          documentos?: Json | null
          estado?: Database["public"]["Enums"]["estado_siniestro_enum"] | null
          fecha_reporte?: string
          fecha_siniestro?: string
          id?: string
          lugar?: string | null
          monto_aprobado?: number | null
          monto_reclamado?: number | null
          numero_siniestro?: string
          observaciones?: string | null
          poliza_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "siniestros_poliza_id_fkey"
            columns: ["poliza_id"]
            isOneToOne: false
            referencedRelation: "polizas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          apellido: string
          created_at: string | null
          email: string
          estado: boolean | null
          id: string
          metadata: Json | null
          nombre: string
          rol_id: string | null
          telefono: string | null
          ultima_sesion: string | null
          updated_at: string | null
        }
        Insert: {
          apellido: string
          created_at?: string | null
          email: string
          estado?: boolean | null
          id?: string
          metadata?: Json | null
          nombre: string
          rol_id?: string | null
          telefono?: string | null
          ultima_sesion?: string | null
          updated_at?: string | null
        }
        Update: {
          apellido?: string
          created_at?: string | null
          email?: string
          estado?: boolean | null
          id?: string
          metadata?: Json | null
          nombre?: string
          rol_id?: string | null
          telefono?: string | null
          ultima_sesion?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_polizas_activas: {
        Row: {
          agente: string | null
          cliente: string | null
          fecha_fin: string | null
          fecha_inicio: string | null
          numero_poliza: string | null
          prima_total: number | null
          producto: string | null
        }
        Relationships: []
      }
      view_vencimientos_proximos: {
        Row: {
          cliente: string | null
          fecha_fin: string | null
          numero_poliza: string | null
          prima_total: number | null
          producto: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calcular_edad: {
        Args: { fecha_nacimiento: string }
        Returns: number
      }
      verificar_vencimiento_poliza: {
        Args: { poliza_id: string }
        Returns: boolean
      }
    }
    Enums: {
      agent_status: "ACTIVE" | "INACTIVE" | "PENDING"
      estado_actividad_enum: "PENDIENTE" | "REALIZADA" | "CANCELADA"
      estado_civil_enum: "SOLTERO" | "CASADO" | "DIVORCIADO" | "VIUDO"
      estado_oportunidad_enum: "NUEVA" | "EN_PROCESO" | "GANADA" | "PERDIDA"
      estado_pago_enum: "PENDIENTE" | "PAGADO" | "ANULADO"
      estado_poliza_enum: "VIGENTE" | "VENCIDA" | "CANCELADA" | "EN_RENOVACION"
      estado_siniestro_enum:
        | "REPORTADO"
        | "EN_PROCESO"
        | "APROBADO"
        | "RECHAZADO"
        | "CERRADO"
      forma_pago_enum: "MENSUAL" | "TRIMESTRAL" | "SEMESTRAL" | "ANUAL"
      genero_enum: "M" | "F" | "OTRO"
      metodo_pago_enum: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA"
      moneda_enum: "USD" | "EUR" | "PEN"
      notification_status: "PENDING" | "SENT" | "FAILED"
      notification_type: "SMS" | "EMAIL" | "PUSH" | "WEBHOOK"
      payment_provider:
        | "STRIPE"
        | "PAYPAL"
        | "PAGOMOVIL"
        | "ZELLE"
        | "BANK_TRANSFER"
      payment_status:
        | "PENDING"
        | "PROCESSING"
        | "COMPLETED"
        | "FAILED"
        | "REFUNDED"
      tipo_actividad_enum: "LLAMADA" | "REUNION" | "EMAIL" | "VISITA"
      tipo_documento_enum: "DNI" | "PASAPORTE" | "RUC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      agent_status: ["ACTIVE", "INACTIVE", "PENDING"],
      estado_actividad_enum: ["PENDIENTE", "REALIZADA", "CANCELADA"],
      estado_civil_enum: ["SOLTERO", "CASADO", "DIVORCIADO", "VIUDO"],
      estado_oportunidad_enum: ["NUEVA", "EN_PROCESO", "GANADA", "PERDIDA"],
      estado_pago_enum: ["PENDIENTE", "PAGADO", "ANULADO"],
      estado_poliza_enum: ["VIGENTE", "VENCIDA", "CANCELADA", "EN_RENOVACION"],
      estado_siniestro_enum: [
        "REPORTADO",
        "EN_PROCESO",
        "APROBADO",
        "RECHAZADO",
        "CERRADO",
      ],
      forma_pago_enum: ["MENSUAL", "TRIMESTRAL", "SEMESTRAL", "ANUAL"],
      genero_enum: ["M", "F", "OTRO"],
      metodo_pago_enum: ["EFECTIVO", "TARJETA", "TRANSFERENCIA"],
      moneda_enum: ["USD", "EUR", "PEN"],
      notification_status: ["PENDING", "SENT", "FAILED"],
      notification_type: ["SMS", "EMAIL", "PUSH", "WEBHOOK"],
      payment_provider: [
        "STRIPE",
        "PAYPAL",
        "PAGOMOVIL",
        "ZELLE",
        "BANK_TRANSFER",
      ],
      payment_status: [
        "PENDING",
        "PROCESSING",
        "COMPLETED",
        "FAILED",
        "REFUNDED",
      ],
      tipo_actividad_enum: ["LLAMADA", "REUNION", "EMAIL", "VISITA"],
      tipo_documento_enum: ["DNI", "PASAPORTE", "RUC"],
    },
  },
} as const
