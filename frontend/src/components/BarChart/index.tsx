import { type } from 'os';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { BASE_URL } from 'utils/request';
import { SaleSucess } from 'types/sale';
import { round } from 'utils/format';

type SeriesData = {
    name : string;
    data : number[];
}

type Chartdata = {
    labels : {
        categories : string[];
    };
    series : SeriesData[];
}

const BarChart = () => {

    const [chartdata, setChartData] = useState<Chartdata>({
        labels : {
            categories : []
        },
        series : [
            {
                name : "",
                data : []
            }
        ]
    });

    useEffect(() => {
        axios.get(`${BASE_URL}/sales/sucess-by-seller`)
        .then((response) => {
            const data = response.data as SaleSucess[];
            const myLabels = data.map(x => x.sellerName);
            const mySeries = data.map(x => round(100.0 * x.deals / x.visited, 1));

            setChartData ({labels : {
                categories : myLabels
            },
            series : [
                {
                    name : "% Sucess",
                    data : mySeries
                }
            ]});
        });
    }, []);

    const options = {
        plotOptions: {
            bar: {
                horizontal: true,
            }
        },
    };
    
    return (
        <Chart 
            options={{ ...options, xaxis:chartdata.labels }}
            series={chartdata.series}
            type="bar"
            height="240"
        />
    );
}

export default BarChart;
