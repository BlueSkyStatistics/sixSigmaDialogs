
var localization = {
    en: {
        title: "Attribute Agreement Analysis",
		navigation: "Attribute Agreement",
		
		//label2: "Two options - either select a non-normal variable to transform to normal if not grouped or select the entire dataset to transform if already grouped",
		//selectVariableRad: "Option 1: Select a non-normal variable from the dataset to be transformed to normal",
		
		variablePartSelcted: "Select the variable for sample/part",
		variableOpSelcted: "Select the variable for appraiser/operator",
		variableRespSelcted: "Select the variable for attribute/response",
		variableRefSelcted: "(Optional) Select the variable for reference/standard response",
		
		alpha: "Confidence interval (alpha) between 0 to 1",
		
		rowsTobeUsed: "Leave blank if all the rows to be used. Otherwise specify the Rows to be used to analyze (e.g.  specify as 1:25 or 1,4,5,7:12)",
		
		//boxcoxChk: "Box-Cox transformation",
		//johnsonChk: "Johnson transformation",
		//digits: "Digits - rounds to the specified number of decimal places",
		
		help: {
            title: "Attribute agreement analysis",
            r_help: "help(kappam.fleiss, package = irr)",
			body: `
				<b>Description</b></br>
				Function to perform attribute agreement analysis
				<br/>
				<br/>
				For the detail help - use R help(kappam.fleiss, package = irr)
				<br/>
				<br/>
				To try this, you may use the sample dataset files attributemsaAB.xlsx for 
				two Operators, A and B, each with 20 observations repated twice with P and F ratings.
				<br/>
				<br/>
				You may also try the sample dataset file attributemsaABCordered.RData with three operators, A, B, C, each with 10 obsevations repeated twice with "ordered" (ordinal) 
				ratings as Disagree, Somewhat Disagree, Neutral, Somewhat Agree, and Agree. 
				<br/>
				<br/>
				Open the files in the data grid with file open menu
				<br/>
			`
		},
	}
}

class attributeAgreement extends baseModal {
    constructor() {
        var config = {
            id: "attributeAgreement",
            label: localization.en.title,
            modalType: "two",
            RCode:`
require(irr)  

modified.kappam.fleiss <- function (ratings, exact = FALSE, detail = FALSE, levels =c())
{
    ratings <- as.matrix(na.omit(ratings))
    ns <- nrow(ratings)
    nr <- ncol(ratings)
    
	if(length(levels) > 0)
	{
		# this is added to modify the kappam.fleiss() to include an optional levels parameter
		# to pass the ordered factor list for the response and reference variables. Without this
		# factor levels are displayed in alphabetical orders in the kappam.fleiss output table
		
		lev = levels 
	}
	else
	{
		lev <- levels(as.factor(ratings))
	}
    
	for (i in 1:ns) {
        frow <- factor(ratings[i, ], levels = lev)
        if (i == 1)
            ttab <- as.numeric(table(frow))
        else ttab <- rbind(ttab, as.numeric(table(frow)))
    }
    ttab <- matrix(ttab, nrow = ns)
    agreeP <- sum((apply(ttab^2, 1, sum) - nr)/(nr * (nr - 1))/ns)
    if (!exact) {
        method <- "Fleiss' Kappa for m Raters"
        chanceP <- sum(apply(ttab, 2, sum)^2)/(ns * nr)^2
    }
    else {
        method <- "Fleiss' Kappa for m Raters (exact value)"
        for (i in 1:nr) {
            rcol <- factor(ratings[, i], levels = lev)
            if (i == 1)
                rtab <- as.numeric(table(rcol))
            else rtab <- rbind(rtab, as.numeric(table(rcol)))
        }
        rtab <- rtab/ns
        chanceP <- sum(apply(ttab, 2, sum)^2)/(ns * nr)^2 - sum(apply(rtab,
            2, var) * (nr - 1)/nr)/(nr - 1)
    }
    value <- (agreeP - chanceP)/(1 - chanceP)
    if (!exact) {
        pj <- apply(ttab, 2, sum)/(ns * nr)
        qj <- 1 - pj
        varkappa <- (2/(sum(pj * qj)^2 * (ns * nr * (nr - 1)))) *
            (sum(pj * qj)^2 - sum(pj * qj * (qj - pj)))
        SEkappa <- sqrt(varkappa)
        u <- value/SEkappa
        p.value <- 2 * (1 - pnorm(abs(u)))
        if (detail) {
            pj <- apply(ttab, 2, sum)/(ns * nr)
            pjk <- (apply(ttab^2, 2, sum) - ns * nr * pj)/(ns *
                nr * (nr - 1) * pj)
            kappaK <- (pjk - pj)/(1 - pj)
            varkappaK <- 2/(ns * nr * (nr - 1))
            SEkappaK <- sqrt(varkappaK)
            uK <- kappaK/SEkappaK
            p.valueK <- 2 * (1 - pnorm(abs(uK)))
            tableK <- as.table(round(cbind(kappaK, SEkappaK, uK, p.valueK),
                digits = 3))
            rownames(tableK) <- lev
            colnames(tableK) <- c("Kappa", "SE Kappa", "z", "p.value")
        }
    }
    if (!exact) {
        if (!detail) {
            rval <- list(method = method, subjects = ns, raters = nr,
                irr.name = "Kappa", value = value)
        }
        else {
            rval <- list(method = method, subjects = ns, raters = nr,
                irr.name = "Kappa", value = value, detail = tableK)
        }
        rval <- c(rval, stat.name = "z", statistic = u, p.value = p.value)
    }
    else {
        rval <- list(method = method, subjects = ns, raters = nr,
            irr.name = "Kappa", value = value)
    }
    class(rval) <- "irrlist"
    return(rval)
}

disagreementStat <- function(response_df)
{
	#print(response_df)
	
	first_level_matched = 0
	second_level_matched = 0
	
	#N is sample size
	N = dim(response_df)[1]
	
	level_reference = levels(response_df$Reference)

	#matched_rows = response_df[apply(response_df, 1, function(row) length(unique(row)) == 1),]
	
	#Rows with all matched
	
	apply(response_df, 1, 
		function(row) 
		{
			if((length(unique(row[1:(length(row)-1)])) == 1) && unique(row[1:(length(row)-1)]) == level_reference[1] && row[length(row)] != level_reference[1] )
			{
				first_level_matched <<- first_level_matched + 1
			}
			
			if((length(unique(row[1:(length(row)-1)])) == 1) && unique(row[1:(length(row)-1)]) == level_reference[2] && row[length(row)] != level_reference[2])
			{
				second_level_matched <<- second_level_matched + 1
			}
		} 
	)
	
	
	mixed_disageement_rows = response_df[apply(response_df, 1, function(row) length(unique(row[1:(length(row)-1)])) != 1),]

	if(!is.matrix(mixed_disageement_rows) && !is.data.frame(mixed_disageement_rows))
	{
		m = 0
		if(length(mixed_disageement_rows) > 0)
			m = 1
	}
	else
	{
		m = dim(mixed_disageement_rows)[1]
	}
	
	#print(c(first_level_matched, (first_level_matched/N)*100, second_level_matched, (second_level_matched/N)*100, m, (m/N)*100 ))															

	invisible(return(c(first_level_matched, (first_level_matched/N)*100, second_level_matched, (second_level_matched/N)*100, m, (m/N)*100 )))															

}

summaryDisagreement <- function(response_list, reference)
{
	reference = as.character(reference)
	samples = length(reference)
	
	#print(response_list)
	#print(reference)
	
	disagreement_df = data.frame(Sample = seq(1:samples), Standard = reference)
	
	lapply(response_list, 
		function(op_response)
		{
			all_count = c()
			all_percent = c()
			
			for(i in 1:samples)
			{
				count = length(which(op_response[i,] != reference[i]))
				percent = count/(length(op_response[i,]))*100
				all_count = c(all_count, count)
				all_percent = c(all_percent, percent)
			}
			
			disagreement_df <<- cbind(disagreement_df, all_count, all_percent)
		}
	)
	
	count_pct_columns = rep(c("Count", "Percent"), length(response_list))
	disagreement_df = rbind(c("Sample", "Standard", count_pct_columns), disagreement_df)
	 
	col_names = c(" ", " ", rep(names(response_list), each=2))
	dimnames(disagreement_df)[[2]] = col_names
	rownames(disagreement_df) = NULL 
	
	invisible(return(disagreement_df))
}

agreementCI <- function(response_df, alpha = 0.95)
{
	#Rows with all matched

	matched_rows = response_df[apply(response_df, 1, function(row) length(unique(row)) == 1),]

	if(!is.matrix(matched_rows) && !is.data.frame(matched_rows))
	{
		# m = dim(matrix(matched_rows, ncol = dim(response_df)[2]))[1]
		m = 1
	}
	else
	{
		m = dim(matched_rows)[1]
	}

		#N is sample size
		N = dim(response_df)[1]

		v1 = 2*m
		v2 = 2*(N - m + 1)

	if(m == N)
	{
		alphaL = (1-alpha)
		alphaU = alpha

		qfl = qf(alphaL, df1=v1, df2=v2)

		LL = (v1* qfl)/(v2 + v1*qfl)
	}
	else if(m !=0)
	{
		alphaL = (1-alpha)/2
		alphaU = alpha + (1-alpha)/2

		qfl = qf(alphaL, df1=v1, df2=v2)

		LL = (v1* qfl)/(v2 + v1*qfl)
	}
	else
	{
		LL = 0
	}


		v1 = 2*(m + 1)
		v2 = 2*(N - m)

	if(m == N)
	{
		UL = 1
	}
	else if(m == 0)
	{
		alphaL = (1-alpha)
		alphaU = alpha
		qfu = qf(alphaU, df1=v1, df2=v2)
		UL = (v1* qfu)/(v2 + v1*qfu)
	}
	else
	{
		alphaL = (1-alpha)/2
		alphaU = alpha + (1-alpha)/2
		qfu = qf(alphaU, df1=v1, df2=v2)
		UL = (v1* qfu)/(v2 + v1*qfu)
	}

	invisible(return(c(m=m,N=N,LL=LL,UL=UL)))
}

plotAgreemnt <- function(df, main_title = c())
{
	ggplot(df, aes(x=Appraiser, y=Percentage, group = Appraiser, label= Percentage, color=Appraiser )) + 
		  geom_line(size = 2) + 
		  geom_point(size = 8, shape = 19) +
		  geom_text(hjust=1.6, vjust=0, size = 6) + 
		  scale_y_continuous(breaks=seq((min(df$Percentage)- (min(df$Percentage)%%10)),100,5))+ 
		  theme_grey(base_size = 20) +
		  theme(plot.title = element_text(size = 20))+
		  ggtitle(main_title) +
		  xlab("Appraiser") + 
		  ylab("Percentage")
}

BSkyAttributeAgreementAnalysis <- function(part, operator, response, reference = c(), alpha = 0.95)
{
	orig_part = part
	orig_operator = operator
	orig_response = response
	orig_reference = reference 
	
	if(is.factor(response)){
		response_levels = levels(response)
	}else{
		all_reponse = as.character(response)
		response_levels = levels(factor(all_reponse))
		#response = sort(unique(all_reponse))
	}
	

	# Optional reference value for response if given
	reference_given = FALSE
	if(length(reference) > 0)
	{
		reference_given = TRUE
		
		if(is.factor(reference)){
			reference = levels(reference)
			orig_reference_levels = levels(orig_reference)
		}else{
			all_reference = as.character(reference)
			reference = levels(factor(all_reference))
			#reference = sort(unique(all_reference))
			orig_reference = factor(all_reference)
			orig_reference_levels = levels(orig_reference)
		}
	}
	
	all_part = as.character(part)
	part = unique(all_part)
	part_len = length(part)
	
	all_operator = as.character(operator)
	operator = unique(all_operator)


	resp_mat = list()
	resp_mat_no_reference = list()
	resp_mat_names = c()
	j = 1
	withinAgreement = c()
	withinAgreement_reference = c()
	
	disagreement_reference = c()
	summaryDisagreement_reference = c()
	
	kappam_fleiss_mat = c()
	kappam_fleiss_mat_reference = c()

	for(i in 1:length(operator))
	{
		observations_per_op = length(which(orig_operator == operator[i]))
		
		Op_resp_mat = matrix(orig_response[j:(j + observations_per_op - 1)],
						  nrow = part_len)
						  
		dimnames(Op_resp_mat)[[2]] = c(paste(operator[i], seq(1:dim(Op_resp_mat)[2]), sep=""))
						  
		resp_mat = c(resp_mat, list(Op_resp_mat))
		resp_mat_no_reference = c(resp_mat_no_reference, list(Op_resp_mat))
		  
		resp_mat_names = c(resp_mat_names, operator[i])
		names(resp_mat) = resp_mat_names
		names(resp_mat_no_reference) = resp_mat_names
		
		#dimnames(resp_mat[[i]])[[2]] = c(paste(operator[i], seq(1:dim(resp_mat[[i]])[2]), sep="")) 
		
		
		CI_stat = agreementCI(response_df = resp_mat[[i]], alpha = alpha)
		
		withinAgreement = rbind(withinAgreement, c(operator[i], CI_stat["m"], CI_stat["N"], (CI_stat["m"]/CI_stat["N"])*100, CI_stat["LL"]*100, CI_stat["UL"]*100))
		
		dimnames(withinAgreement)[[2]] = c("Operator", "Agreement", "Inspected", "%Aggreement", paste(format(round(alpha, 2), nsmall = 2),"CI (lower)"), paste(format(round(alpha, 2), nsmall = 2),"CI (upper)"))
		
		kappam_fleiss = (modified.kappam.fleiss(resp_mat[[i]], detail=TRUE, levels = response_levels))$detail
		kappam_fleiss = cbind(Operator=c(operator[i], rep("",dim(kappam_fleiss)[1]-1)), Response = dimnames(kappam_fleiss)[[1]], kappam_fleiss)
		rownames(kappam_fleiss) = NULL
		kappam_fleiss_mat = rbind(kappam_fleiss_mat, kappam_fleiss )
		
		if(reference_given == TRUE)
		{
			tries_by_op = paste(operator[i], seq(1:dim(resp_mat[[i]])[2]), sep="")
			resp_mat[[i]] = cbind(resp_mat[[i]], orig_reference[j:(j + part_len -1)])
			resp_mat[[i]] = as.data.frame(resp_mat[[i]])
			resp_mat[[i]][,dim(resp_mat[[i]])[2]] = factor(resp_mat[[i]][,dim(resp_mat[[i]])[2]])
			levels(resp_mat[[i]][,dim(resp_mat[[i]])[2]]) = orig_reference_levels
			
			dimnames(resp_mat[[i]])[[2]] = c(tries_by_op, "Reference")
			
			CI_stat = agreementCI(response_df = resp_mat[[i]], alpha = alpha)
		
			withinAgreement_reference = rbind(withinAgreement_reference, c(operator[i], CI_stat["m"], CI_stat["N"], (CI_stat["m"]/CI_stat["N"])*100, CI_stat["LL"]*100, CI_stat["UL"]*100))
			dimnames(withinAgreement_reference)[[2]] = c("Operator", "Agreement", "Inspected", "%Aggreement", paste(format(round(alpha, 2), nsmall = 2),"CI (lower)"), paste(format(round(alpha, 2), nsmall = 2),"CI (upper)"))
			
			kappam_fleiss = (modified.kappam.fleiss(resp_mat[[i]], detail=TRUE, levels = orig_reference_levels))$detail
			kappam_fleiss = cbind(Operator=c(operator[i], rep("",dim(kappam_fleiss)[1]-1)), Response = dimnames(kappam_fleiss)[[1]], kappam_fleiss)
			rownames(kappam_fleiss) = NULL
			kappam_fleiss_mat_reference = rbind(kappam_fleiss_mat_reference, kappam_fleiss )
			
			if(length(orig_reference_levels) == 2)
			{
				disagreement_stat = disagreementStat(response_df = resp_mat[[i]])
				disagreement_reference = rbind(disagreement_reference, c(operator[i], disagreement_stat))
				dimnames(disagreement_reference)[[2]] = c("Operator", 
																paste("# ",orig_reference_levels[1],"/",orig_reference_levels[2], sep=""), 
																"Percent", 
																paste("# ",orig_reference_levels[2],"/",orig_reference_levels[1], sep=""),
																"Percent",
																"# Mixed", "Percent")
			}
		}
		
		j = j + observations_per_op
	}
	
	
	#print(resp_mat)

	between_agreement_response_mat = c()                        
	x = lapply(resp_mat_no_reference, function(x){between_agreement_response_mat <<- cbind(between_agreement_response_mat,x)})
	
	CI_stat = agreementCI(response_df = between_agreement_response_mat, alpha = alpha)
	between_agreement_mat = matrix(c("All", CI_stat["m"], CI_stat["N"], (CI_stat["m"]/CI_stat["N"])*100, CI_stat["LL"]*100, CI_stat["UL"]*100), nrow = 1)
	dimnames(between_agreement_mat)[[2]] = c("Operator", "Agreement", "Inspected", "%Aggreement", paste(format(round(alpha, 2), nsmall = 2),"CI (lower)"), paste(format(round(alpha, 2), nsmall = 2),"CI (upper)"))

	kappam_fleiss_all = (modified.kappam.fleiss(between_agreement_response_mat, detail=TRUE, levels = response_levels))$detail
	kappam_fleiss_mat_all = cbind(Operator=c("All", rep("",dim(kappam_fleiss_all)[1]-1)), Response = dimnames(kappam_fleiss_all)[[1]], kappam_fleiss_all)
	rownames(kappam_fleiss_mat_all) = NULL

	if(reference_given == TRUE)
	{
		between_agreement_response_mat = c()                        
		x = lapply(resp_mat_no_reference, function(x){between_agreement_response_mat <<- cbind(between_agreement_response_mat,x)})
		
		between_agreement_response_mat = as.data.frame(between_agreement_response_mat)
		between_agreement_response_mat = cbind(between_agreement_response_mat, Reference = orig_reference[1:part_len])
  
		between_agreement_response_mat[,dim(between_agreement_response_mat)[2]] = factor(between_agreement_response_mat[,dim(between_agreement_response_mat)[2]])
		levels(between_agreement_response_mat[,dim(between_agreement_response_mat)[2]]) = orig_reference_levels
		
		CI_stat = agreementCI(response_df = between_agreement_response_mat, alpha = alpha)
		between_agreement_mat_reference = matrix(c("All", CI_stat["m"], CI_stat["N"], (CI_stat["m"]/CI_stat["N"])*100, CI_stat["LL"]*100, CI_stat["UL"]*100), nrow = 1)
		dimnames(between_agreement_mat_reference)[[2]] = c("Operator", "Agreement", "Inspected", "%Aggreement", paste(format(round(alpha, 2), nsmall = 2),"CI (lower)"), paste(format(round(alpha, 2), nsmall = 2),"CI (upper)"))

		kappam_fleiss_all_reference = (modified.kappam.fleiss(between_agreement_response_mat, detail=TRUE, levels = orig_reference_levels))$detail
		kappam_fleiss_mat_all_reference = cbind(Operator=c("All", rep("",dim(kappam_fleiss_all_reference)[1]-1)), Response = dimnames(kappam_fleiss_all_reference)[[1]], kappam_fleiss_all_reference)
		rownames(kappam_fleiss_mat_all_reference) = NULL
		
		if(length(orig_reference_levels) == 2)
		{
			summaryDisagreement_reference = summaryDisagreement(response_list = resp_mat_no_reference, reference = orig_reference[1:part_len])
		}
	}
	

	BSkyFormat(withinAgreement, outputTableRenames = c("Within Appraiser Agreement")) 	
	BSkyFormat(kappam_fleiss_mat, outputTableRenames = c("Within Appraiser Fleiss Kappa Statistic"))
	BSkyFormat(between_agreement_mat, outputTableRenames = c("Between Appraiser Agreement"))
	BSkyFormat(kappam_fleiss_mat_all, outputTableRenames = c("Between Appraiser Fleiss Kappa Statistic"))

	if(reference_given == TRUE)
	{
		BSkyFormat(withinAgreement_reference, outputTableRenames = c("Each Appraiser Agreement Vs Standard"))
		
		if(length(disagreement_reference) > 0)  
		{
			BSkyFormat(disagreement_reference, outputTableRenames = c("Each Appraiser Disagreement Vs Standard"))
		}
		
		BSkyFormat(kappam_fleiss_mat_reference, outputTableRenames = c("Each Appraiser Vs Standard Fleiss Kappa Statistic"))
		BSkyFormat(between_agreement_mat_reference, outputTableRenames = c("All Appraisers Agreement Vs Standard"))
		
		if(length(summaryDisagreement_reference) > 0)  
		{
			BSkyFormat(summaryDisagreement_reference, outputTableRenames = c("Summary of Appraiser Disagreement Vs Standard"))
		}
		
		BSkyFormat(kappam_fleiss_mat_all_reference, outputTableRenames = c("All Appraisers Vs Standard Fleiss Kappa Statistic"))
	}
	
	# Plot Graphs
	
	ggplot_df1 = NULL
	y_percentage = round(as.numeric(c(t(withinAgreement[,c(4:6)]))), digit=2)
	x_appraiser = c(sapply(operator, function(x) rep(x,3)))
	ggplot_df1 = data.frame(Appraiser = x_appraiser, Percentage = y_percentage)
	
	#plotAgreemnt(df = ggplot_df1, main_title = c("Confidence Intervals Within Appraisers"))
	
	ggplot_df2 = NULL 
	if(reference_given == TRUE)
	{	
		y_percentage = round(as.numeric(c(t(withinAgreement_reference[,c(4:6)]))), digit=2)
		x_appraiser = c(sapply(operator, function(x) rep(x,3)))
		ggplot_df2 = data.frame(Appraiser = x_appraiser, Percentage = y_percentage)
		
		#plotAgreemnt(df = ggplot_df2, main_title = c("Confidence Intervals Against Reference"))
	}
	
	invisible(return(list(ggplot_df1, ggplot_df2)))
}


{{if(options.selected.rowsTobeUsed !== "")}}
	temp_attributemsa_df = {{dataset.name}}[c({{selected.rowsTobeUsed | safe}}),] 
{{#else}}
	temp_attributemsa_df = {{dataset.name}}
{{/if}}	
temp_attributemsa_df = temp_attributemsa_df[order(temp_attributemsa_df[,'{{selected.variableOpSelcted | safe}}']),]

plot_mat = NULL
plot_mat = BSkyAttributeAgreementAnalysis( part = temp_attributemsa_df[,'{{selected.variablePartSelcted | safe}}'],
							    operator = temp_attributemsa_df[,'{{selected.variableOpSelcted | safe}}'],
							    response = temp_attributemsa_df[,'{{selected.variableRespSelcted | safe}}'],
					{{if(options.selected.variableRefSelcted !== "")}}
							    reference = temp_attributemsa_df[,'{{selected.variableRefSelcted | safe}}'],
					{{/if}}	
							    alpha = {{selected.alpha | safe}}
							  )

if(!is.null(plot_mat))
{
	plotAgreemnt(df = plot_mat[[1]], main_title = c("Confidence Intervals Within Appraisers"))
}

{{if(options.selected.variableRefSelcted !== "")}}
if(!is.null(plot_mat))
{
	plotAgreemnt(df = plot_mat[[2]], main_title = c("Confidence Intervals Against Standard"))
}
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
			variableRespSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableRespSelcted,
                    no: "variableRespSelcted",
                    required: true,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "String|Ordinal|Nominal",
					//style: "mt-1 ml-3",
                    extraction: "NoPrefix",
                }), r: ['{{ var | safe}}']
            },
			variableRefSelcted: {
                el: new dstVariable(config, {
                    label: localization.en.variableRefSelcted,
                    no: "variableRefSelcted",
                    required: false,
                    //filter: "String|Numeric|Logical|Ordinal|Nominal|Scale",
					filter: "String|Ordinal|Nominal",
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
        };
        const content = {
            left: [objects.content_var.el.content],
            right: [
					//objects.boxcoxChk.el.content,
					//objects.johnsonChk.el.content,
					//objects.label2.el.content,
					
					objects.variablePartSelcted.el.content,
					objects.variableOpSelcted.el.content,
					objects.variableRespSelcted.el.content,
					
					objects.variableRefSelcted.el.content,
					objects.alpha.el.content,
					
					objects.rowsTobeUsed.el.content,
					
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
module.exports.item = new attributeAgreement().render()