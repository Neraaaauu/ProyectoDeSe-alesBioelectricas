const Patron = [
0,0.02,0.04,0.02,0,-0.03,-0.05,0.1,1,-0.3,0.05,0.08,0.05,0.02,0
];

let InfoOnda = [];
while(InfoOnda.length < 1000){
    InfoOnda = InfoOnda.concat(Patron);
}
InfoOnda = InfoOnda.slice(0,1000);


const etiquetas = Array.from({length:1000}, (_,i)=>i);

const ctx = document.getElementById('OndaChart').getContext('2d');

const chart = new Chart(ctx,{
    type:'line',
    data:{
        labels:etiquetas,
        datasets:[{
            label:'Señal ECG',
            data:InfoOnda,
            borderColor:'white',
            borderWidth:2,
            tension:0.2,
            pointRadius:0
        }]
    },
    options:{
        responsive:true,
        plugins:{
            legend:{
                labels:{color:"white"}
            },

            zoom:{
                pan:{
                    enabled:true,
                    mode:'x'
                },

                zoom:{
                    wheel:{
                        enabled:true
                    },
                    mode:'x'
                }
            }
        },

        scales:{
            x:{
                ticks:{color:"white"},
                grid:{color:"#333"}
            },
            y:{
                min:-0.5,
                max:1.2,
                ticks:{color:"white"},
                grid:{color:"#333"}
            }
        }
    }
});

function resetZoom(){
    chart.resetZoom();
}
