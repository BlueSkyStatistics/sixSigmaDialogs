
var localization = {
    en: {
        title: "Loss Function Analysis",
		navigation: "Loss Function Analysis",
		lfaSubTitle: "Subtitle for the graphic output",
		independent: "Column containing the data for the loss function analysis",
		lfaDelta: "Tolerance of the process",
		lfaY0: "Target of the process",
		lfaL0: "Cost of poor quality at tolerance limit",
		lfaSize: "Size of the production, batch, etc. to calculate the total loss in a group (span, batch, period, ...)",
		lfaOutput: "Type of output (possible values - text, plot or both)",
		
		help: {
            title: "Loss Function Analysis",
            r_help: "help(ss.lfa, package = SixSigma)",
			body: `
				<b>Description</b></br>
				ss.lfa function to perform a Quality Loss Function Analysis based in the Taguchi Loss Function for "Nominal-the-Best" characteristics.
				<br/>
				<br/>
				For the detail help - use R help(ss.lfa, package = SixSigma)
				<br/>
				<br/>
				To try this, you may use the sample dataset file called loss_function_table.xlsx. Open the file in the data grid with file open menu
				<br/>
			`
		},
	}
}

class lossFunctionAnalysis extends baseModal {
    constructor() {
        var config = {
            id: "lossFunctionAnalysis",
            label: localization.en.title,
            modalType: "two",
            RCode: `
				require(SixSigma)

				#SixSigma Loss Function Analysis

				SixSigma::ss.lfa(lfa.data = {{dataset.name}}, 
						lfa.ctq = {{selected.independent | safe}}, 
						lfa.sub = "{{selected.lfaSubTitle | safe}}", 
						lfa.Delta = {{selected.lfaDelta | safe}}, 
						lfa.Y0 = {{selected.lfaY0 | safe}},  
						lfa.L0 = {{selected.lfaL0 | safe}},  
						lfa.size = c({{selected.lfaSize | safe}}),  
						lfa.output = "{{selected.lfaOutput | safe}}" )

				`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move"}) },
			lfaSubTitle: {
                el: new input(config, {
                    no: 'lfaSubTitle',
                    label: localization.en.lfaSubTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Six Sigma project ID or name for Loss Analysis"
                })
            },
			independent: {
                el: new dstVariable(config, {
                    label: localization.en.independent,
                    no: "independent",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|Enclosed",
                }), r: ['{{ var | safe}}']
            },
			lfaDelta: {
                el: new input(config, {
                    no: 'lfaDelta',
                    label: localization.en.lfaDelta,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.5",
                })
            },
			lfaY0: {
                el: new input(config, {
                    no: 'lfaY0',
                    label: localization.en.lfaY0,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "10",
                })
            },
			lfaL0: {
                el: new input(config, {
                    no: 'lfaL0',
                    label: localization.en.lfaL0,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.001",
                })
            },
			lfaSize: {
                el: new input(config, {
                    no: 'lfaSize',
                    label: localization.en.lfaSize,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			lfaOutput: {
                el: new input(config, {
                    no: 'lfaOutput',
                    label: localization.en.lfaOutput,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "plot",
                })
            },
        };
		
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.lfaSubTitle.el.content, 
					objects.independent.el.content,
					objects.lfaDelta.el.content,
					objects.lfaY0.el.content,
					objects.lfaL0.el.content,
					objects.lfaSize.el.content,
					objects.lfaOutput.el.content],
            nav: {
                name: localization.en.navigation,
                icon: "icon-sixsigma",
                modal: config.id
            }
        };
        super(config, objects, content);
        this.help = localization.en.help;
    }
}
module.exports.item = new lossFunctionAnalysis().render()