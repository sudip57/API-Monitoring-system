import { useAppContext } from "../../../context/GlobalAppContext";
import ServiceKpiCard from './components/ServiceKpiCard';
import {useServiceOverview} from '../../../services/useServiceOverview'
const serviceOverview = () => {
const { timeRange } = useAppContext();
const { data, loading, error } = useServiceOverview(timeRange.from,timeRange.to);
if (!data || data.length === 0) {
    return <div>No service data</div>;
  }
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 m-2">
        {data.services.map(item=>{
            return <ServiceKpiCard key={item.serviceName} service={item} />;
        })}
    </div>
    </>
  )
}
export default serviceOverview
