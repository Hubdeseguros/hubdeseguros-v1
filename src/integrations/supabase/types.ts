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
      agencias: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      auditoria: {
        Row: {
          accion: string
          detalle: string | null
          fecha: string | null
          id: string
          usuario_id: string
        }
        Insert: {
          accion: string
          detalle?: string | null
          fecha?: string | null
          id?: string
          usuario_id: string
        }
        Update: {
          accion?: string
          detalle?: string | null
          fecha?: string | null
          id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auditoria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          creado_por: string | null
          created_at: string | null
          email: string | null
          id: string
          nombre: string
          promotor_id: string
        }
        Insert: {
          creado_por?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre: string
          promotor_id: string
        }
        Update: {
          creado_por?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string
          promotor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clientes_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "promotores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clientes_promotor_id_fkey"
            columns: ["promotor_id"]
            isOneToOne: false
            referencedRelation: "promotores"
            referencedColumns: ["id"]
          },
        ]
      }
      notificaciones: {
        Row: {
          fecha_envio: string | null
          id: string
          leida: boolean | null
          mensaje: string
          titulo: string
          usuario_id: string
        }
        Insert: {
          fecha_envio?: string | null
          id?: string
          leida?: boolean | null
          mensaje: string
          titulo: string
          usuario_id: string
        }
        Update: {
          fecha_envio?: string | null
          id?: string
          leida?: boolean | null
          mensaje?: string
          titulo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notificaciones_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pagos: {
        Row: {
          created_at: string | null
          estado: string
          fecha_pago: string
          id: string
          metodo_pago: string
          monto: number
          poliza_id: string
          referencia: string | null
        }
        Insert: {
          created_at?: string | null
          estado: string
          fecha_pago: string
          id?: string
          metodo_pago: string
          monto: number
          poliza_id: string
          referencia?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          fecha_pago?: string
          id?: string
          metodo_pago?: string
          monto?: number
          poliza_id?: string
          referencia?: string | null
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
      polizas: {
        Row: {
          cliente_id: string
          created_at: string | null
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id: string
          monto: number
          numero_poliza: string
          tipo: string
        }
        Insert: {
          cliente_id: string
          created_at?: string | null
          estado: string
          fecha_fin: string
          fecha_inicio: string
          id?: string
          monto: number
          numero_poliza: string
          tipo: string
        }
        Update: {
          cliente_id?: string
          created_at?: string | null
          estado?: string
          fecha_fin?: string
          fecha_inicio?: string
          id?: string
          monto?: number
          numero_poliza?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "polizas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
        ]
      }
      promotores: {
        Row: {
          agencia_id: string
          creado_por: string | null
          created_at: string | null
          email: string | null
          id: string
          nombre: string
        }
        Insert: {
          agencia_id: string
          creado_por?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre: string
        }
        Update: {
          agencia_id?: string
          creado_por?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotores_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promotores_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id?: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      usuario_roles: {
        Row: {
          rol_id: number
          usuario_id: string
        }
        Insert: {
          rol_id: number
          usuario_id: string
        }
        Update: {
          rol_id?: number
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_roles_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_roles_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          activo: boolean | null
          creado_por: string | null
          created_at: string | null
          email: string
          id: string
          nombre: string
          password_hash: string
        }
        Insert: {
          activo?: boolean | null
          creado_por?: string | null
          created_at?: string | null
          email: string
          id?: string
          nombre: string
          password_hash: string
        }
        Update: {
          activo?: boolean | null
          creado_por?: string | null
          created_at?: string | null
          email?: string
          id?: string
          nombre?: string
          password_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_creado_por_fkey"
            columns: ["creado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios_agencia: {
        Row: {
          agencia_id: string
          created_at: string | null
          usuario_id: string
        }
        Insert: {
          agencia_id: string
          created_at?: string | null
          usuario_id: string
        }
        Update: {
          agencia_id?: string
          created_at?: string | null
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_agencia_agencia_id_fkey"
            columns: ["agencia_id"]
            isOneToOne: false
            referencedRelation: "agencias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_agencia_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
