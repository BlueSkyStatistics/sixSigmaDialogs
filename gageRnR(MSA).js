
var localization = {
    en: {
        title: "Gage R&R - Measurement System Analysis",
		navigation: "Gage R&R",
		mainTitle: "Main title for the graphic output",
		subTitle: "Subtitle for the graphic output (e.g. the name of the SixSigma project)",
		measuredVar: "Measured variable",
		part: "Part variable",
		appr: "Appraiser (operators, machines, ...) variable",
		lsl: "LSL - numeric value of lower specification limit used with USL to calculate Study Variation as %Tolerance",
		usl: "USL - numeric value of upper specification limit used with LSL to calculate Study Variation as %Tolerance",
		sigma: "Sigma - numeric value for number of std deviations to use in calculating Study Variation",
		tolerance: "Tolerance - numeric value for the tolerance - default (usl - lsl)",
		alphaLim: "Alpha - Limit to take into account interaction",
		errorTerm: "Which term of the model should be used as error term (for the model with interation)",
		//method: "Type of analysis to perform, crossed (default) or nested",
		
		help: {
            title: "Gage R&R - Measurement System Analysis",
            r_help: "help(ss.rr, package = SixSigma)",
			body: `
				<b>Description</b></br>
				ss.rr function to perform Gage R&R analysis for the assessment of the measurement system of a process
				<br/>
				<br/>
				For the detail help - use R help(ss.rr, package = SixSigma)
				<br/>
				<br/>
				To try this, you may use the sample dataset file called gageR_R_piston_diameter_with_measurements.xlsx. Open the file in the data grid with file open menu
				<br/>
				from the sample dataset, select diameter variable to Measured variable, Pistonring to Part variable and Operator to Appraiser 
				<br/>
			`
		},
	}
}

class gageRnR extends baseModal {
    constructor() {
        var config = {
            id: "gageRnR",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(SixSigma)

#SixSigma Gage R&R - Measurement System Analysis

			temp_gageRnR = SixSigma::ss.rr(
			  main = "{{selected.mainTitle | safe}}",
			  sub = "{{selected.subTitle | safe}}",
			  data = {{dataset.name}},
			  var = {{selected.measuredVar | safe}},
			  part = {{selected.part | safe}},
			  appr = {{selected.appr | safe}},
			  lsl = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}),
			  usl = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}),
			  tolerance = if(!is.null(c({{selected.tolerance | safe}}))) c({{selected.tolerance | safe}}) else {if(!is.null(c({{selected.usl | safe}})) && !is.null(c({{selected.lsl | safe}}))) c(c({{selected.usl | safe}})-c({{selected.lsl | safe}})) else c(NA)},
			  sigma = c({{selected.sigma | safe}}),
			  alphaLim = c({{selected.alphaLim | safe}}),
			  errorTerm = "{{selected.errorTerm | safe}}",
			  digits = BSkyGetDecimalDigitSetting(),
			  method = "crossed",
			  print_plot = TRUE,
			  signifstars = FALSE
			)
			
			for(i in 1:(length(temp_gageRnR) - 1)){
				table_name = names(temp_gageRnR)[i]
				table_name = switch(  
						i,  
						c("Anova - Complete model (with interaction)"),  
						c(paste("Anova - Reduced model (without interaction - alpha: ",c({{selected.alphaLim | safe}}),")", sep="")),  
						c("Gage R&R"),  
						c("%StudyVar %Tolerance")
				)  
				BSkyFormat(temp_gageRnR[[i]], outputTableRenames = table_name)
			}
			BSkyFormat(paste("Number of Distinct Categories:",temp_gageRnR[5]))
`
        };

        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
			mainTitle: {
                el: new input(config, {
                    no: 'mainTitle',
                    label: localization.en.mainTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Six Sigma Gage R&R Study",
                })
            },
			subTitle: {
                el: new input(config, {
                    no: 'subTitle',
                    label: localization.en.subTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "Six Sigma project ID or name for Gage R&R Study",
                })
            },
			measuredVar: {
                el: new dstVariable(config, {
                    label: localization.en.measuredVar,
                    no: "measuredVar",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|Enclosed",
                }), r: ['{{ var | safe}}']
            },
			part: {
                el: new dstVariable(config, {
                    label: localization.en.part,
                    no: "part",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|Enclosed",
                }), r: ['{{ var | safe}}']
            },
			appr: {
                el: new dstVariable(config, {
                    label: localization.en.appr,
                    no: "appr",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix|Enclosed",
                }), r: ['{{ var | safe}}']
            },
			lsl: {
                el: new input(config, {
                    no: 'lsl',
                    label: localization.en.lsl,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			usl: {
                el: new input(config, {
                    no: 'usl',
                    label: localization.en.usl,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			sigma: {
                el: new input(config, {
                    no: 'sigma',
                    label: localization.en.sigma,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "6",
                })
            },
			tolerance: {
                el: new input(config, {
                    no: 'tolerance',
                    label: localization.en.tolerance,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "usl - lsl",
                })
            },
			alphaLim: {
                el: new input(config, {
                    no: 'alphaLim',
                    label: localization.en.alphaLim,
                    placeholder: "",
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.05",
                })
            },
			errorTerm: {
                el: new input(config, {
                    no: 'errorTerm',
                    label: localization.en.errorTerm,
                    placeholder: "",
                    required: false,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "interaction",
                })
            },
			/*
			method: {
                el: new selectVar(config, {
                    no: 'method',
                    label: localization.en.method,
                    multiple: false,
                    required: true,
                    extraction: "NoPrefix|UseComma",
					options: ["crossed", "nested"],
                    default: "crossed",
                })
            },
			*/
        };
		
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.mainTitle.el.content, 
					objects.subTitle.el.content,
					objects.measuredVar.el.content,
					objects.part.el.content,
					objects.appr.el.content,
					objects.lsl.el.content,
					objects.usl.el.content,
					objects.tolerance.el.content,
					objects.sigma.el.content,
					objects.alphaLim.el.content,
					objects.errorTerm.el.content],
					//objects.method.el.content],
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
module.exports.item = new gageRnR().render()