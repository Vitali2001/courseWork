import './index.css';
import {React} from "react"

const EclipseWidgetContainer = () => {
    return (
        <div className="my_eclipse">
            <div className="progress">
                <div>
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );

}
const EclipseWidget = (EclipseWidgetContainer);
export default EclipseWidget;