
var localization = {
    en: {
        title: "Process Capability Analysis",
		navigation: "Process Capability (SixSigma pkg)",
		
		measuredVar: "Variable with the data of the process performance",
		lsl: "LSL - numeric value of lower specification limit",
		usl: "USL - numeric value of upper specification limit",
		ciChk: "Compute a Confidence Interval",
		alphaLim: "Alpha - Type I error (α) for the Confidence Interval",
		
		capabilityStudyChk: "Show graphs and figures for the Process Capability Study",
		target: "Target of the process",
		futureProcessVar: "Variable with the data of the long term process performance",
		mainTitle: "Main title for the graphic output",
		subTitle: "Subtitle for the graphic output (e.g. the name of the Six Sigma project)",
		
		ciMeanChk: "Plot Confidence Interval for the mean",
		sigma2: "The population variance, if known",
		ciMeanMainTitle: "Main title for the Confidence Interval for the mean graphic output",
		ciMeanSubTitle: "Subtitle for the graphic output (e.g. the name of the Six Sigma project)",
		
		help: {
            title: "Process Capability Analysis",
            r_help: "help(ss.ca.cp, package = SixSigma)",
			body: `
				<b>Description</b></br>
				ss.ca.cp function to compute the Capability Indices of a process, Z (Sigma Score), C_p and C_{pk}.
				<br/>
				<br/>
				For the detail help - use R help(ss.ca.cp, package = SixSigma)
				<br/>
				<br/>
				To try this, you may use the sample dataset file called process_capability_study_table.xlsx. Open the file in the data grid with file open menu
				<br/>
				from the sample dataset, select widgets variable, type 745 in LSL, 760 in USL, 755 in Target 
				<br/>
			`
		},
		
	}
}

class processCapabilityAnalysis extends baseModal {
    constructor() {
        var config = {
            id: "processCapabilityAnalysis",
            label: localization.en.title,
            modalType: "two",
            RCode: `
require(SixSigma)

#SixSigma Process Capability Analysis

			temp_cp_return = SixSigma::ss.ca.cp(x = {{dataset.name}}\${{selected.measuredVar | safe}}, 
											LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
											USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
											LT = FALSE, 
											f.na.rm = TRUE, 
											ci = FALSE, 
											alpha = 0.05)
			BSkyFormat(data.frame(Cp=temp_cp_return), outputTableRenames = "Cp value without Confidence Intervals")
			
			
			if({{selected.ciChk | safe}})
			{
				temp_cp_return = ss.ca.cp(x = {{dataset.name}}\${{selected.measuredVar | safe}}, 
												LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
												USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
												LT = FALSE, 
												f.na.rm = TRUE, 
												ci = TRUE, 
												alpha = if(is.null(c({{selected.alphaLim | safe}}))) c(0.05) else c({{selected.alphaLim | safe}}))
				BSkyFormat(temp_cp_return, outputTableRenames = "Cp value with Confidence Intervals")
			}
			
			temp_cpk_return = ss.ca.cpk(x = {{dataset.name}}\${{selected.measuredVar | safe}}, 
											LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
											USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
											LT = FALSE, 
											f.na.rm = TRUE, 
											ci = FALSE, 
											alpha = 0.05)
			BSkyFormat(data.frame(Cpk=temp_cpk_return), outputTableRenames = "Cpk value without Confidence Intervals")
			
			
			if({{selected.ciChk | safe}})
			{
				temp_cpk_return = ss.ca.cpk(x = {{dataset.name}}\${{selected.measuredVar | safe}}, 
												LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
												USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
												LT = FALSE, 
												f.na.rm = TRUE, 
												ci = TRUE, 
												alpha = if(is.null(c({{selected.alphaLim | safe}}))) c(0.05) else c({{selected.alphaLim | safe}}))
				BSkyFormat(temp_cpk_return, outputTableRenames = "Cpk value with Confidence Intervals")
			}
			
			temp_cpz_return = ss.ca.z(x = {{dataset.name}}\${{selected.measuredVar | safe}}, 
											LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
											USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
											LT = FALSE, 
											f.na.rm = TRUE)
			BSkyFormat(data.frame(Cp_Z = temp_cpz_return), outputTableRenames = "Cp Z value")
			
			if({{selected.capabilityStudyChk | safe}})
			{
				ss.study.ca(xST = {{dataset.name}}\${{selected.measuredVar | safe}}, 
							xLT = if(is.null(c({{selected.futureProcessVar | safe}}))) c(NA) else c({{selected.futureProcessVar | safe}}), 
							LSL = if(is.null(c({{selected.lsl | safe}}))) c(NA) else c({{selected.lsl | safe}}), 
							USL = if(is.null(c({{selected.usl | safe}}))) c(NA) else c({{selected.usl | safe}}), 
							Target = if(is.null(c({{selected.target | safe}}))) c(NA) else c({{selected.target | safe}}), 
							alpha = if(is.null(c({{selected.alphaLim | safe}}))) c(0.05) else c({{selected.alphaLim | safe}}), 
							f.na.rm = TRUE, 
							f.main = "{{selected.mainTitle | safe}}", 
							f.sub = "{{selected.subTitle | safe}}")
			}
			
			if({{selected.ciMeanChk | safe}})
			{
				suppressWarnings(
					ss.ci(
						  x = {{selected.measuredVar | safe}},
						  sigma2 = if(is.null(c({{selected.sigma2 | safe}}))) c(NA) else c({{selected.sigma2 | safe}}),
						  alpha = if(is.null(c({{selected.alphaLim | safe}}))) c(0.05) else c({{selected.alphaLim | safe}}),
						  data = {{dataset.name}},
						  xname = "{{selected.measuredVar | safe}}",
						  approx.z = FALSE,
						  main = "{{selected.ciMeanMainTitle | safe}}",
						  digits = BSkyGetDecimalDigitSetting(),
						  sub = "{{selected.ciMeanSubTitle | safe}}",
						  ss.col = c("#666666", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE")
						)
				)
			}
`
        };

        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) },
			measuredVar: {
                el: new dstVariable(config, {
                    label: localization.en.measuredVar,
                    no: "measuredVar",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			lsl: {
                el: new input(config, {
                    no: 'lsl',
                    label: localization.en.lsl,
                    placeholder: "",
                    required: true,
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
                    required: true,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "",
                })
            },
			ciChk: {
                el: new checkbox(config, {
                    label: localization.en.ciChk, 
					no: "ciChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
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
					style: "ml-5 mb-2",
                    value: "0.05",
                })
            },
			capabilityStudyChk: {
                el: new checkbox(config, {
                    label: localization.en.capabilityStudyChk, 
					no: "capabilityStudyChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			target: {
                el: new input(config, {
                    no: 'target',
                    label: localization.en.target,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
					style: "ml-5",
                    value: "",
                })
            },
			futureProcessVar: {
                el: new dstVariable(config, {
                    label: localization.en.futureProcessVar,
                    no: "futureProcessVar",
                    required: false,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
                    extraction: "Prefix",
                }), r: ['{{ var | safe}}']
            },
			mainTitle: {
                el: new input(config, {
                    no: 'mainTitle',
                    label: localization.en.mainTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
					style: "ml-5",
                    value: "Six Sigma Process Capability Analysis Study",
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
					style: "ml-5 mb-2",
                    value: "Six Sigma project ID or name for Process Capability Study",
                })
            },
			ciMeanChk: {
                el: new checkbox(config, {
                    label: localization.en.ciMeanChk, 
					no: "ciMeanChk",
                    bs_type: "valuebox",
                    style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: "FALSE",
					newline: true,
                })
            },
			sigma2: {
                el: new input(config, {
                    no: 'sigma2',
                    label: localization.en.sigma2,
                    placeholder: "",
                    required: false,
                    type: "numeric",
                    extraction: "TextAsIs",
					allow_spaces:true,
					style: "ml-5",
                    value: "",
                })
            },
			ciMeanMainTitle: {
                el: new input(config, {
                    no: 'ciMeanMainTitle',
                    label: localization.en.ciMeanMainTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
					style: "ml-5",
                    value: "Confidence Interval for the Mean",
                })
            },
			ciMeanSubTitle: {
                el: new input(config, {
                    no: 'ciMeanSubTitle',
                    label: localization.en.ciMeanSubTitle,
                    placeholder: "",
                    required: true,
                    type: "character",
                    extraction: "TextAsIs",
					allow_spaces:true,
					style: "ml-5",
                    value: "Six Sigma project ID or name",
                })
            },
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [objects.measuredVar.el.content,
					objects.lsl.el.content,
					objects.usl.el.content,
					objects.ciChk.el.content,
					objects.alphaLim.el.content,
					objects.capabilityStudyChk.el.content,
					objects.target.el.content,
					objects.futureProcessVar.el.content,
					objects.mainTitle.el.content,
					objects.subTitle.el.content,
					objects.ciMeanChk.el.content,
					objects.sigma2.el.content,
					objects.ciMeanMainTitle.el.content,
					objects.ciMeanSubTitle.el.content],
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
module.exports.item = new processCapabilityAnalysis().render()