const nav = {
    "name": "Six Sigma",
    "tab": "six_sigma",
    "buttons": [
        "./SixSigmaOverview",
        "./createCauseEffectDiagram",
        "./paretoChart",
        "./lossFunctionAnalysis",
        "./gageRnR(MSA)",
        {
            "name": "Process Capability",
            "icon": "icon-sixsigma",
            "children": [
                "./ProcessCapability(qcc)",
                "./processCapabilityAnalysis"
            ]
        },
        {
            "name": "Shewhart Charts",
            "icon": "icon-sixsigma",
            "children": [
                "./shewhartCharts1",
                "./shewhartCharts2",
                "./shewhartCharts3"
            ]
        },
        "./cusumChart",	
        "./ewmaChart",
        "./mqccChart"				
    ]
}

module.exports.nav = nav
