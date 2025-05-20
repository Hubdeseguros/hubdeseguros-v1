import { Check, AlertCircle, Shield, Users, UserPlus, Building2, UserIcon, Clock } from "lucide-react";
import { UserRole } from '@/types/permissions';

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low' | 'alta' | 'media' | 'baja';
  dueDate?: string;
  completed?: boolean;
  assignedTo?: string;
  role?: UserRole;
  createdAt?: string;
}

interface TaskListProps {
  tasks: Task[];
  title?: string;
  emptyMessage?: string;
}

const TaskList = ({ tasks, title = "Tareas", emptyMessage = 'No hay tareas pendientes' }: TaskListProps) => {
  const getPriorityDot = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
      case 'alta':
        return 'bg-red-500';
      case 'medium':
      case 'media':
        return 'bg-yellow-500';
      case 'low':
      case 'baja':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-blue-600" />;
      case 'AGENCIA':
        return <Users className="h-4 w-4 text-purple-600" />;
      case 'PROMOTOR':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'ASISTENTE':
        return <Building2 className="h-4 w-4 text-yellow-600" />;
      case 'CLIENTE':
        return <UserIcon className="h-4 w-4 text-gray-600" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="p-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center py-6">{emptyMessage}</p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-start p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">
                <div className="flex-shrink-0 h-5 w-5 rounded-full border-2 border-gray-300 mr-3 flex items-center justify-center hover:border-hubseguros-primary hover:bg-hubseguros-primary/10 transition-colors">
                  <Check className={`h-3 w-3 ${task.completed ? 'text-hubseguros-primary' : 'text-transparent'} hover:text-hubseguros-primary`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${getPriorityDot(task.priority)}`} />
                    {task.role && getRoleIcon(task.role)}
                    <p className="font-medium text-sm flex items-center gap-1">
                      {task.priority === 'alta' && <AlertCircle className="text-red-500 h-4 w-4" />}
                      {task.title}
                    </p>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {task.dueDate && (
                      <span className="text-xs text-gray-500">
                        <Clock className="h-4 w-4 inline-block mr-1" />
                        {task.dueDate}
                      </span>
                    )}
                    {task.assignedTo && (
                      <span className="text-xs text-gray-500">
                        <UserIcon className="h-4 w-4 inline-block mr-1" />
                        {task.assignedTo}
                      </span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TaskList;
