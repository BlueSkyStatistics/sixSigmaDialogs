const nav = {
    "name": "Six Sigma",
    "tab": "six_sigma",
    "buttons": [
        "./SixSigmaOverview",
        "./createCauseEffectDiagram",
        "./paretoChart",
        "./lossFunctionAnalysis",
        {
            "name": "MSA",
            "icon": "icon-sixsigma",
            "children": [
                "./gageRnR(MSA)",
                "./AttributeAgreement"
            ]
        },
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
                "./shewhartCharts3",
                "./shewhartCharts4"
            ]
        },
        "./cusumChart",	
        "./ewmaChart",
        "./mqccChart"				
    ]
}

module.exports.nav = nav
