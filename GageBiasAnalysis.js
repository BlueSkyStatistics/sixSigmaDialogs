
var localization = {
    en: {
        title: "Gage Bias Analysis",
		navigation: "Gage Bias Analysis",
		
		//label2: "Two options - either select a non-normal variable to transform to normal if not grouped or select the entire dataset to transform if already grouped",
		//selectVariableRad: "Option 1: Select a non-normal variable from the dataset to be transformed to normal",
		
		//variablePartSelcted: "Select the variable for sample/part",
		//variableOpSelcted: "Select the variable for appraiser/operator",
		variableRespSelcted: "(Optional if bias variable is selected) Select the variable for measurement/response",
		variableRefSelcted: "Select the variable for reference/standard value",
		variableBiasSelcted: "(Optional) Select the variable for bias if avaiable; Otherwise it will be computed automatically",
		
		alpha: "Confidence interval for linearity (between 0 to 1)",
		
		//rowsTobeUsed: "Leave blank if all the rows to be used. Otherwise specify the Rows to be used to analyze (e.g.  specify as 1:25 or 1,4,5,7:12)",
		
		//boxcoxChk: "Box-Cox transformation",
		//johnsonChk: "Johnson transformation",
		//digits: "Digits - rounds to the specified number of decimal places",
		
		help: {
            title: "Gage bias analysis",
            r_help: "help(lm, package = stats)",
			body: `
				<b>Description</b></br>
				Function to perform linearity bias analysis
				<br/>
				<br/>
				For the detail help - use R help(lm, package = stats)
				<br/>
				<br/>
				To try this, you may use the sample dataset files linearityBias.xlsx. Open the files in the data grid with file open menu
				<br/>
				Choose the variables from the selection box, Reference and Measurement
				<br/>
			`
		},
	}
}

class GageBiasAnalysis extends baseModal {
    constructor() {
        var config = {
            id: "GageBiasAnalysis",
            label: localization.en.title,
            modalType: "two",
            RCode:`

require(ggplot2)

{{if(options.selected.variableRespSelcted === "" && options.selected.variableBiasSelcted === "")}}
		BSkyFormat("Error: Measurement/Response or Bias variable must be specified")
{{#else}}
		{{if(options.selected.variableBiasSelcted !== "")}}
			GageBias = {{dataset.name}}[, c('{{selected.variableBiasSelcted | safe}}')] 
		{{#else}}
			GageBias = {{dataset.name}}\${{selected.variableRespSelcted | safe}} - {{dataset.name}}\${{selected.variableRefSelcted | safe}}
		{{/if}}	
		
		{{if(options.selected.variableRespSelcted !== "")}}
			GageResp = {{dataset.name}}[, c('{{selected.variableRespSelcted | safe}}')] 
		{{#else}}
			GageResp = {{dataset.name}}\${{selected.variableBiasSelcted | safe}} + {{dataset.name}}\${{selected.variableRefSelcted | safe}}
		{{/if}}		

		ggplot(data={{dataset.name}}, aes(x = {{selected.variableRefSelcted | safe}}, y = GageBias)) +
			geom_smooth(formula = y ~ x, method ="lm", alpha=1, se=FALSE, level= {{selected.alpha | safe}}, aes(color='Regression')) +  
			stat_smooth(formula = y ~ x, method = "lm", level= {{selected.alpha | safe}},
				geom ="ribbon", fill = NA, fullrange = TRUE, 
					linetype = 2, aes(color= '{{selected.alpha | safe}}% CI')) + 
			geom_point() +
			stat_summary(
				aes(fill ='Avg Bias'),
				fun = "mean",        
				geom = "point",
				size = 4,
				shape = 15,
				color='blue1'
			) +
			scale_color_manual(name='',
					breaks=c('Regression', '{{selected.alpha | safe}}% CI'),
					values=c('Regression'='red', '{{selected.alpha | safe}}% CI'='#727272')) +
			scale_fill_manual(name='',values = c('Avg Bias'= 'blue1'))+
			labs(x="{{selected.variableRefSelcted | safe}}",y="Bias",title= "Scatterplot for Gage Linearity and Bias Analysis") +
			xlab("{{selected.variableRefSelcted | safe}}") +
			ylab("Bias") + 
			theme_grey(base_size = 20) +
			theme(plot.title = element_text(size = 20)) 

		LinearRegModel1 = lm(formula = GageBias~{{selected.variableRefSelcted | safe}}, data={{dataset.name}},
			 na.action=na.exclude) %>% 
				BSkyFormat(outputTableIndex = c(3,1), coefConfInt = {{selected.alpha | safe}}, outputTableRenames=c("Gage Linearity - Coefficients"))

		mean_bias <- cbind({{dataset.name}},GageBias = GageBias) %>% 
				group_by({{selected.variableRefSelcted | safe}}) %>% 
				summarise("Avg Bias" = mean(GageBias))
		mean_bias = rbind(mean_bias, c("Overall", mean(GageBias)))

		pvals = c()

		calulatePvalues <- function()
		{
			pvalues = c()
			lapply(split(cbind({{dataset.name}},GageResp = GageResp), factor({{dataset.name}}\${{selected.variableRefSelcted | safe}})), 
				 function(x)
				 {
					 pvalues <<- c(pvalues, sprintf(paste("%.",BSkyGetDecimalDigitSetting(),"f",sep=""),(t.test(x\${{selected.variableRefSelcted | safe}}, x\$GageResp, conf.level = {{selected.alpha | safe}} ))$p.value))
				 }
			)
			invisible(return(pvalues))
		}

		pvals = calulatePvalues()
		pvals = c(pvals, sprintf(paste("%.",BSkyGetDecimalDigitSetting(),"f",sep=""),(t.test({{dataset.name}}\${{selected.variableRefSelcted | safe}}, GageResp, conf.level = {{selected.alpha | safe}}))$p.value))
		mean_bias = cbind(mean_bias, p.value = pvals)

		BSkyFormat(as.data.frame(mean_bias), outputTableRenames=c("Gage Bias"), repeatAllTableFooter = "Sample standard deviation method used for P value")
{{/if}}

`
        };
        var objects = {
            content_var: { el: new srcVariableList(config, {action: "move", scroll:true}) }, 
			/*
			boxcoxChk: {
                el: new checkbox(config, {
                    label: localization.en.boxcoxChk, 
					no: "boxcoxChk",
                    bs_type: "valuebox",
                    //style: "mt-2 mb-1",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: " ",
					state: "checked",
					newline: true,
                })
            },
			johnsonChk: {
                el: new checkbox(config, {
                    label: localization.en.johnsonChk, 
					no: "johnsonChk",
                    bs_type: "valuebox",
                    style: "mb-2",
                    extraction: "BooleanValue",
                    true_value: "TRUE",
                    false_value: " ",
					newline: true,
                })
            },
			digits: {
                el: new inputSpinner(config, {
                    no: 'digits',
                    label: localization.en.digits,
                    required: true,
                    min: 0,
                    max: 15,
                    step: 1,
                    value: 4,
					width: "w-25",
					style: "mb-2",
                })
            },     
			label2: { 
				el: new labelVar(config, { 
					label: localization.en.label2, 
					h: 6, 
					style: "mb-2",
				}) 
			},
			*/
			/*
			variablePartSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variablePartSelcted,
                    no: "variablePartSelcted",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					//filter: "Numeric|Scale",
					//style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			variableOpSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableOpSelcted,
                    no: "variableOpSelcted",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					//filter: "Numeric|Scale",
					//style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			*/
			variableRespSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableRespSelcted,
                    no: "variableRespSelcted",
                    required: false,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					//filter: "String|Ordinal|Nominal",
					//style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			variableRefSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableRefSelcted,
                    no: "variableRefSelcted",
                    required: true,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					//filter: "String|Ordinal|Nominal",
					style: "mb-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			variableBiasSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableBiasSelcted,
                    no: "variableBiasSelcted",
                    required: false,
                    filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					//filter: "String|Ordinal|Nominal",
					style: "mb-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			alpha: {
                el: new input(config, {
                    no: 'alpha',
                    label: localization.en.alpha,
                    placeholder: "",
                    required: true,
                    type: "numeric",
					filter: "numeric",
					style: "mb-3",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    value: "0.95",
                })
            },
			/*
			rowsTobeUsed: {
                el: new input(config, {
                    no: 'rowsTobeUsed',
                    label: localization.en.rowsTobeUsed,
                    placeholder: "",
                    required: false,
                    //type: "character",
					filter: "character|numeric",
					//style: "ml-5",
                    extraction: "TextAsIs",
					allow_spaces:true,
                    //value: "",
					wrapped: '%val%',
                })
            },
			*/
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [
					//objects.boxcoxChk.el.content,
					//objects.johnsonChk.el.content,
					//objects.label2.el.content,
					
					//objects.variablePartSelcted.el.content,
					//objects.variableOpSelcted.el.content,
					
					objects.variableRefSelcted.el.content,
					objects.variableRespSelcted.el.content,
					objects.variableBiasSelcted.el.content,
					
					objects.alpha.el.content,
					
					//objects.rowsTobeUsed.el.content,
					
					//objects.digits.el.content
					],
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
module.exports.item = new GageBiasAnalysis().render()