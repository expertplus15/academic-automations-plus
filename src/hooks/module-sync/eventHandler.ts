
import { ModuleSyncEvent } from './types';
import { 
  syncExamCreated, 
  syncExamUpdated, 
  syncSubjectCreated, 
  syncStudentEnrolled, 
  syncRoomReserved 
} from './syncActions';

export const handleSyncAction = async (
  event: ModuleSyncEvent, 
  syncConfig: any, 
  publishEvent: Function
) => {
  const { module, action, data } = event;
  
  switch (`${module}:${action}`) {
    case 'exams:created':
      await syncExamCreated(data);
      break;
    case 'exams:updated':
      await syncExamUpdated(data, syncConfig, publishEvent);
      break;
    case 'academic:subject_created':
      await syncSubjectCreated(data, syncConfig);
      break;
    case 'students:enrolled':
      await syncStudentEnrolled(data);
      break;
    case 'resources:room_reserved':
      await syncRoomReserved(data);
      break;
    default:
      console.log(`Unhandled sync action: ${module}:${action}`);
  }
};
