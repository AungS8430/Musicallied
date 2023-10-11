const { getChart } = require('billboard-top-100');

let weekof;
getChart((err, chart) => {
    if (err) console.log(err);
    weekof = chart.week;
});
getChart((err, chart) => {
    if (err) console.log(err);
    if (chart.week != weekof) {
        weekof = chart.week;
        console.log("Chart updated!");
    } else {
        console.log("Chart not updated!");
    }
})