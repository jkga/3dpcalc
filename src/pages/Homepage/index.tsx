import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Icon, Menu, Image, Divider, Step, Message, Label, Grid, Button, Checkbox, Segment, Radio, Modal, Dropdown, Transition } from 'semantic-ui-react'
import { jsPDF } from "jspdf"
import { SimpleTemplate } from '../../templates/simple'
import Logo from './assets/img/logo.png'
import bill from './assets/img/bill.png'
import watts from './assets/img/watts.png'
import prusa from './assets/img/prusa-mk3s.jpeg'
import anycubic from './assets/img/anycubic.png'
import './index.css'

const Homepage = () => {
  const [currency, setCurrency] : any = useState <string>('PHP')
  const [activeStep, setActiveStep] : any = useState <number>(0)
  const [showOtherChargingOptions, setShowOtherChargingOptions] : any = useState <boolean>(false)
  const [filamentWeight, setFilamentWeight] : any = useState <number >(0);
  const [filamentPrice, setFilamentPrice]: any = useState <number | string>(0);
  const [filamentAmount, setFilamentAmount]: any = useState <number | string>(0);
  const [printWeight, setPrintWeight] : any = useState <number | string>(0);
  const [printTimeHours, setPrintTimeHours]: any = useState <number | string>(0);
  const [printTimeMinutes, setPrintTimeMinutes]: any = useState <number | string>(0);

  // modal name settings
  const [modelInputModalIsVisible, setModelInputModalIsVisible] = useState <boolean>(false)
  const [modelName, setModelName] = useState <string>('')

  // printer settings
  const [printerType, setPrinterType] : any = useState <string>('fdm')
  const [scaleAnimationVisibility, setScaleAnimationVisibility]:any = useState <boolean>(false)
  
  // power consumption from recent bill
  const [powerMonthlyConsumption, setPowerMonthlyConsumption]: any = useState <number | string>(0);
  const [powerMonthlyDue, setPowerMonthlyDue]: any = useState <number | string>(0);
  const [powerConsumptionPerHour, setPowerConsumptionPerHour]: any = useState <number | string>(0);

  // power consumption
  const [printerPowerEnergyConsumption, setPrinterPowerEnergyConsumption]: any = useState <number | string>(0);
  const [printerPowerConsumptionPerHour, setPrinterPowerConsumptionPerHour]: any = useState <number | string>(0);
  const [printerRatedPower, setPrinterRatedPower]: any = useState <number | string>(0);

  // 30% initial markup for 3d printing cost
  const [markup, setMarkup]: any = useState <number>(30);
  const [totalMarkup, setTotalMarkup]: any = useState <number>(0);
  const [totalCostWithMarkup, setTotalCostWithMarkup]: any = useState <number>(0);
  const [profit, setProfit]: any = useState <number>(0);

  // additional options
  const [setupFee, setSetupFee] : any = useState <number | string>(0)
  const [packagingFee, setPackagingFee] : any = useState <number | string>(0)
  const [deliveryFee, setDeliveryFee] : any = useState <number | string>(0)
  const [laborFee, setLaborFee] : any = useState <number | string>(0)
  const [otherFee, setOtherFee] : any = useState <number | string>(0)
  const [totalOtherCost, setTotalOtherCost]: any = useState <number>(0);
  
  // computed total amount
  const [totalPrintTime, setTotalPrintTime]: any = useState <number | string>(0);
  const [totalPrintCostPerGram, setTotalPrintCostPerGram]: any = useState <number | string>(0);
  const [totalPrintCostPerHour, setTotalPrintCostPerHour]: any = useState <number | string>(0);
  const [totalPrintEnergyConsumption, setTotalPrintEnergyConsumption]: any = useState <number | string>(0);
  
  // currency settings
  const currencyConfig = {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    currencyDisplay: "symbol",
  }

  const currencyOptions = [
    {
      key: 'php',
      text: 'PHP',
      value: 'PHP',
      content: 'PHP',
    },
    {
      key: 'usd',
      text: 'USD',
      value: 'USD',
      content: 'USD',
    },
  ]


  /**
   * Export to PDF
   */
  const exportToPDF : any = () => {
    const doc = new jsPDF('p', 'pt', 'a4', true)
    doc.setFontSize(12)
    const simpleTemplate = new SimpleTemplate({
      model: {
        materialCost: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format((totalPrintCostPerGram || 0).toFixed(2)),
        electricityCost: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format((totalPrintCostPerHour || 0).toFixed(2)),
        markup,
        markupCost: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(totalMarkup.toFixed(2)),
      },
      others: {
        setupFee: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(setupFee || 0),
        packagingFee: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(packagingFee || 0),
        deliveryFee: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(deliveryFee || 0),
        otherFee: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(otherFee || 0),
      },
      total: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(totalCostWithMarkup || 0),
      currency,
      modelName,
      printerType,
      materials: {
        filamentWeight,
        filamentPrice: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(filamentPrice || 0),
        filamentAmount: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(filamentAmount || 0),
      },
      printOutput: {
        printWeight,
        printTimeHours,
        printTimeMinutes
      },
      laborFee: new Intl.NumberFormat('en', {minimumFractionDigits: 2}).format(laborFee || 0),
    })

    doc.setFontSize(8);
    doc.text(`Generated: ${new Date()}`, 50, doc.internal.pageSize.height - 10)
    doc.html(simpleTemplate.render(),{
      callback: function (doc) {
        doc.save(modelName.length ? modelName : '3dpCalc PDF')
        // uncomment the code below to allow debug mode
        // window.open(URL.createObjectURL(doc.output("blob")))
      }
    })

  }

  const Paginator = (opt:any = {}) => {
    return(
      <Grid style={{marginTop: 20}}>
        <Grid.Row>
          <Grid.Column width={3} style={{marginTop: 10}}>
            { (typeof opt.backStep !== 'undefined' || '') && <Button size="small" className="float-left" onClick={() => setActiveStep(opt.backStep)}>Back</Button> }
          </Grid.Column>
          { (typeof opt.controls === 'undefined' || '') && <Grid.Column width={10}></Grid.Column> }
          <Grid.Column width={3} style={{marginTop: 10}}>
            { (opt.nextStep || '') && <Button size="small" className="float-right" onClick={() => setActiveStep(opt.nextStep)} secondary>Next</Button> }
          </Grid.Column>
          { (typeof opt.controls !== 'undefined' || '') && opt.controls }
        </Grid.Row>
      </Grid>
    );
  }

  /**
   * Filament / Material
   */
  useEffect (() => {
    let filamentAmountPerGram: number = 0
    // convert filament in kg to g and divide by the acquired cost
    filamentAmountPerGram = parseFloat(filamentPrice || 0) / (parseFloat(filamentWeight || 0) * 1000)
    setFilamentAmount(filamentAmountPerGram)
    // compute total cost per gram
    // total = Filament Price (g) * Print Output Weight(g)
    setTotalPrintCostPerGram (filamentAmountPerGram * parseFloat(printWeight || 0))
  }, [filamentWeight, filamentPrice, printWeight])

  /**
   * Print Output: Time
   */
  useEffect (() => {
    // convert hours to minutes
    setTotalPrintTime(parseFloat(printTimeMinutes || 0) + (parseFloat(printTimeHours || 0) * 60))
  }, [printTimeHours, printTimeMinutes])

  useEffect (() => {
    /**
     * Given
     * You have a total energy consumption of PHP 8.759468599033816 per 0.2875kWh based on your recent usage (30 Days)Hourly Energy Consumption: 2.518347222222222
     * Printers Rated Power = 35 W
     */

    // convert watts to kWh
    // 0.35
    let printerRatedKwh: number = printerRatedPower / 1000

    // 0.35 - 0.2875 = 0.0625
    let excessKwhFromPrinterRatedKwh: any = printerRatedKwh - powerConsumptionPerHour

    // 8.759468599033816
    let energyConsumption: any = (parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0))

    // 8.759468599033816 * 0.0625 = 0.547466787439614
    let exessEnergyConsumption: any = energyConsumption * excessKwhFromPrinterRatedKwh

    // 8.759468599033816 + 0.547466787439614 = 9.30693538647343
    let newPrinterEnergyConsumption = parseFloat(exessEnergyConsumption) + parseFloat(energyConsumption)

    // stop computation for empty printer's wattage
    if(!printerRatedPower) {
       // convert hours to minutes
       let energyConsumption: number = parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)
       let kWh: number = parseFloat(powerMonthlyConsumption || 0) / (24 * 30)
       let energyConsumptionPerKwh: number = energyConsumption * kWh
   
       // derive kWh from monthly power consumption (30 days only)
       setPowerConsumptionPerHour (kWh) 
       setTotalPrintEnergyConsumption(!isNaN(energyConsumption) ? energyConsumptionPerKwh.toFixed(2) : 0)
      return
    }

    // update total energy consumption
    // 9.30693538647343 * 0.35 = 3.2574273852657005
    setTotalPrintEnergyConsumption ((newPrinterEnergyConsumption * printerRatedKwh).toFixed(2))
    setPrinterPowerEnergyConsumption (newPrinterEnergyConsumption)
    setPrinterPowerConsumptionPerHour (printerRatedKwh)
  }, [printerRatedPower, powerConsumptionPerHour, powerMonthlyConsumption, powerMonthlyDue])

  useEffect (() => {
    // convert minutes to hour
    let totalPrintHours: number = parseFloat(totalPrintTime) / 60
    setTotalPrintCostPerHour(!isNaN(totalPrintEnergyConsumption) ? totalPrintEnergyConsumption * totalPrintHours : 0)
  }, [totalPrintTime,totalPrintEnergyConsumption])

  useEffect (() => {
     // convert hours to minutes
     let energyConsumption: number = parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)
     let kWh: number = parseFloat(powerMonthlyConsumption || 0) / (24 * 30)
     let energyConsumptionPerKwh: number = energyConsumption * kWh
 
     // derive kWh from monthly power consumption (30 days only)
     setPowerConsumptionPerHour (kWh) 
     setTotalPrintEnergyConsumption(!isNaN(energyConsumption) ? energyConsumptionPerKwh.toFixed(2) : 0)
  }, [powerMonthlyConsumption, powerMonthlyDue])

  /**
   * Other Charges
   */
  useEffect(() => {
    let __totalPrice: number = parseFloat(totalPrintCostPerGram || 0) + parseFloat(totalPrintCostPerHour || 0)
    let __markup: number = __totalPrice * (parseFloat(markup || 0) / 100)
    let __total: number = __totalPrice + __markup +  parseFloat(laborFee || 0)
    let __totalOtherChargingOptions = parseFloat(setupFee || 0) + parseFloat(deliveryFee || 0) + parseFloat(packagingFee || 0)  +  parseFloat(otherFee || 0)
    setTotalMarkup(__markup)
    setProfit (__markup +  parseFloat(laborFee || 0))
    setTotalOtherCost (__totalOtherChargingOptions)
    setTotalCostWithMarkup (__total + __totalOtherChargingOptions)
  }, [totalPrintCostPerHour, totalPrintCostPerGram, markup, setupFee, deliveryFee, packagingFee, otherFee, laborFee, showOtherChargingOptions])

  /**
   * Clear value of other charging options
   */
  useEffect(() => {
    setSetupFee(0)
    setOtherFee(0)
    setPackagingFee(0)
    setDeliveryFee(0)
  }, [showOtherChargingOptions])

  /**
   * Show model name modal with delay
   */
  useEffect(() => {
    setTimeout(() => setModelInputModalIsVisible (true), 1500)
  }, [])
  /**
   * Printer type animation
   */
  useEffect(() => {
    setScaleAnimationVisibility(false)
    setTimeout(() => {
      setScaleAnimationVisibility(true)
    }, 1)
  }, [printerType])

  return (
    <Container text>
      { /* Banner And Logo */}
      <Menu secondary style={{padding: '20px'}}>
        <Menu.Menu position='left'>
          <Menu.Item className='hidden-xs logo-section'>
            <Image as='a' href='/' src={Logo} className="logo"/>
          </Menu.Item>
          <Menu.Item>
            <Header as="h1">
              <Header.Content>3D Print Calculator</Header.Content>
              <Header.Subheader className="subHeader">Calculate your 3d printing cost</Header.Subheader>
              <Header.Subheader className="subHeader">
                <small>
                  <Icon name='github'/>
                  <a href="https://github.com/jkga/3dpcalc">https://github.com/jkga/3dpcalc</a>
                </small>
              </Header.Subheader>
            </Header>
          </Menu.Item>
        </Menu.Menu>
      </Menu>

      { /* Main Navigation */}
      <Step.Group ordered unstackable size="mini" className="hidden-xs mainStepper">
        <Step completed={Boolean(printerType)} active={activeStep === 0} onClick={() => setActiveStep(0)}>
          <Step.Content>
            <Step.Title>Printer Type</Step.Title>
            <Step.Description>Define your printer</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(filamentAmount)} active={activeStep === 1} onClick={() => setActiveStep(1)}>
          <Step.Content>
            <Step.Title>Materials</Step.Title>
            <Step.Description>Weigh your materials</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintTime) && Boolean(printWeight)} active={activeStep === 2} onClick={() => setActiveStep(2)}>
          <Step.Content>
            <Step.Title>Print Output</Step.Title>
            <Step.Description>Measure your print time</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintEnergyConsumption)} active={activeStep === 3} onClick={() => setActiveStep(3)}>
          <Step.Content>
            <Step.Title>Power Consumption</Step.Title>
            <Step.Description>Estimate your power consumption</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintCostPerGram) && Boolean(totalPrintCostPerHour)} active={activeStep === 4} onClick={() => setActiveStep(4)}>
          <Step.Content>
            <Step.Title>Results</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>


      { /* Printer Type */}
      <Container style={{display: activeStep === 0 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          {/* Printer Settings */}
          <Header as='h3' dividing>
            Printer
            <Header.Subheader>Select printer type</Header.Subheader>
          </Header>

          <Container style={{paddingTop: 30, paddingBottom: 20}}>
            { (printerType === 'fdm' || '') &&
              <Transition visible={scaleAnimationVisibility} animation='scale' duration={500}>
                <Container textAlign="center">
                  <Image src={prusa} className="logo" verticalAlign="middle" width={270}/>
                </Container>
              </Transition>
            }

            { (printerType === 'sla' || '') &&
              <Transition visible={scaleAnimationVisibility} animation='scale' duration={500}>
                <Container textAlign="center"><Image src={anycubic} className="logo" verticalAlign="middle" width={120}/></Container>
              </Transition>
            }
          </Container>

          <Grid columns='equal' textAlign="center">
            <Grid.Column width={4}>
              <Form.Field>
                <Radio label='FDM' name='printerType' value='fdm'  onChange={(_e, data) => setPrinterType(data.value)} defaultChecked checked={printerType === 'fdm'}/>
              </Form.Field>
            </Grid.Column>

            <Grid.Column width={8}>
              <Form.Field>
                <Radio label='SLA' name='printerType' value='sla' onChange={(_e, data) => setPrinterType(data.value)} checked={printerType === 'sla'}/>
              </Form.Field>
            </Grid.Column>
          </Grid>
        </Form>
        <Paginator nextStep={1}/>
        <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='cube' /></Divider>
      </Container>


      { /* Filament */}
      <Container style={{display: activeStep === 1 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          {/* Filament */}
          { (printerType === 'fdm' || '') &&
            <>
              <Header as='h3' dividing>
                Filament
                <Header.Subheader>Price and weight of filament used in your model</Header.Subheader>
              </Header>
              <Form.Field>
                <label>Weight (kg)</label>
                <input type="number" placeholder='Kilogram' min={0} value={filamentWeight || ''} onChange={(e) => setFilamentWeight(e.target.value)}/>
              </Form.Field>
              <Form.Field>
                <label>Price <b>({currency})</b></label>
                <input type="number" placeholder='Enter Amount' min={0} value={filamentPrice || ''} onChange={(e) => setFilamentPrice(e.target.value)}/>
              </Form.Field>
              <Form.Field>
                <label>Estimated Amount Per Gram <b>({currency})</b></label>
                <input type="text" placeholder='Total Amount Per Gram' value={!isNaN(filamentAmount.toFixed(2)) ? new Intl.NumberFormat('en', currencyConfig).format(filamentAmount.toFixed(2)): ''}  readOnly disabled/>
              </Form.Field>
            </>
          }

          {/* Resin */}
          { (printerType === 'sla' || '') &&
            <>
              <Header as='h3' dividing>
                Resin
                <Header.Subheader>Price and weight of resin used in your model</Header.Subheader>
              </Header>
              <Form.Field>
                <label>Volume (L)</label>
                <input type="number" placeholder='Liter' min={0} value={filamentWeight || ''} onChange={(e) => setFilamentWeight(e.target.value)}/>
              </Form.Field>
              <Form.Field>
                <label>Price <b>({currency})</b></label>
                <input type="number" placeholder='Enter Amount' min={0} value={filamentPrice || ''} onChange={(e) => setFilamentPrice(e.target.value)}/>
              </Form.Field>
              <Form.Field>
                <label>Estimated Amount Per Mililiter(ml) <b>({currency})</b></label>
                <input type="text" placeholder='Total Amount Per Mililiter(ml)' value={!isNaN(filamentAmount.toFixed(2)) ? new Intl.NumberFormat('en', currencyConfig).format(filamentAmount.toFixed(2)): ''}  readOnly disabled/>
              </Form.Field>
            </>
          }

        </Form>
        <Paginator nextStep={2} backStep={0}/>
        <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='cube' /></Divider>
      </Container>

      { /* Print Output */}
      <Container style={{display: activeStep === 2 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          <Header as='h3' dividing>
            Print Output
            <Header.Subheader>Actual print {printerType === 'fdm' ? 'Weight' : 'volume' } and time</Header.Subheader>
          </Header>

          <Form.Field>
            <label>{ printerType === 'fdm' ? 'Weight' : 'Volume' }</label>
            <input type="number" placeholder={printerType === 'fdm' ? 'Grams' : 'Mililiters (ml)' } value={printWeight || ''} onChange={(e) => setPrintWeight(e.target.value)} min={0}/>
          </Form.Field>
          <Form.Field>
            <label>Time to print <b>(Hours)</b></label>
            <input type="number" placeholder='Enter Print Time (Hours)' min={0} value={printTimeHours || ''} onChange={(e) => setPrintTimeHours(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Time to print <b>(Minutes)</b></label>
            <input type="number" placeholder='Enter Print Time (Minutes)' value={printTimeMinutes || ''} onChange={(e) => setPrintTimeMinutes(e.target.value)}/>
          </Form.Field>

          { (totalPrintTime || '') &&
            <Message size='tiny' color='green'>
              <p><Icon name='info' />You have a total print time of <b>{totalPrintTime}</b> minute(s)</p>
            </Message>
          }
          <Paginator nextStep={3} backStep={1}/>
          <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='print' /></Divider>
        </Form>
      </Container>
      
      { /* Power Consumption */}
      <Container style={{display: activeStep === 3 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          <Header as='h3' dividing>
            Power Consumption
            <Header.Subheader>Compute electricity bill for your 3d print</Header.Subheader>
          </Header>

          <Message size='tiny' color='orange'>
            <Message.Header><Icon name='help' /> How to measure my power consumption</Message.Header>
            <p>Please click the "Show Computation" text below for instructions</p>
          </Message>

          { /* Advance Power Consumption's Computation */}
          <details style={{paddingBottom: 20, marginBottom: 30}}>
            <summary>Show Computation</summary><br/>
            <Message color='grey'>
              <p><Icon name='info circle'/> In your <b>most recent electricity bill</b>, please look for the <em>"Total kWh"</em> and <em>"Total Current Amount"</em> section.<br/>
                Please see image below for reference.
              </p>
            </Message>

            <Image as='div' src={bill} width={'100%'} className='bill'/>
            <small><p>&emsp;Sample electricity bill from the Philippines</p></small><br/><br/>

            <Form.Field>
              <label>Monthly kWh Consumption</label>
              <input type="number" placeholder='kWh' min={0}  value={powerMonthlyConsumption || ''} onChange={(e) => setPowerMonthlyConsumption(e.target.value)}/>
            </Form.Field>
            <Form.Field>
              <label>Amount Due</label>
              <input type="number" placeholder='Enter Amount' min={0}  value={powerMonthlyDue || ''} onChange={(e) => {  setPowerMonthlyDue(e.target.value); setPrinterRatedPower(0); }}/>
            </Form.Field>

            { /* Power Consumption Results */}
            { ((powerMonthlyConsumption && powerMonthlyDue) || '') && <Message size='tiny' color='green'>
                <p><Icon name='info' />You have a total energy consumption of {currency}<u>{(parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)).toFixed(2) || ''}</u>/kWh  based on your recent usage (30 Days) with an 
                <em> <Label>hourly</Label> rate of <Label>{currency}{(((parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)) || 0) * (powerConsumptionPerHour || 0)).toFixed(2) }</Label></em> equivalent to <u>{powerConsumptionPerHour.toFixed(2)}kWh</u>
                </p><br/>
                <p>Please enter your power supply's wattage to get more acurate results</p>
                <Image as='div' src={watts} width={'100%'} className='bill'/>
                <Form.Field>
                  <label>Printer's Rated Power <span>(Please refer to your power supply's wattage)</span></label>
                  <input type="number" placeholder='Watts' min={0} style={{width: '90%'}} value={printerRatedPower || ''} onChange={(e) => setPrinterRatedPower(e.target.value)}/>
                </Form.Field>
                { ((printerPowerEnergyConsumption && printerRatedPower) || '') && 
                  <p style={{color: 'red'}}>New total energy consumption: {currency}<u>{printerPowerEnergyConsumption.toFixed(2)}</u>/kWh <br/>
                  Estimated hourly consumption: <u>{printerPowerConsumptionPerHour.toFixed(2)}kW</u></p>
                }
              </Message>
            }
          </details>

          <Form.Field>
            <label>Estimated Amount/hour <b>({currency})</b></label>
            <input type="number" placeholder='Energy Consumption per kWh' min={0} value={totalPrintEnergyConsumption || ''} onChange={(e) => setTotalPrintEnergyConsumption(e.target.value)}/>
          </Form.Field>
        </Form>
        <Paginator nextStep={4} backStep={2}/>
        <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='plug' /></Divider>
      </Container>

      <Container style={{display: activeStep === 4 ? 'block': 'none'}} className='totalPrintCostSegmentContainer'>
      { /* Total Printing Cost*/}
        <Segment style={{border: 'none', boxShadow: 'none'}} className="totalPrintCostSegment">
          <Grid columns={2} stackable>
            <Divider vertical></Divider>
            <Grid.Row verticalAlign='middle'>
              <Grid.Column>
                <Form style={{paddingTop: 30}}> 
                  <Header as='h3' dividing>Total Printing Cost</Header>
                  <p>
                    <Label color='teal' style={{margin: 5}}>
                      <Icon name='cube'/> Material
                      <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format((totalPrintCostPerGram || 0).toFixed(2))}</Label.Detail>
                    </Label>
                  </p>
                  <p>
                    <Label color='teal' style={{margin: 5}}>
                      <Icon name='coffee'/> Printing Hour: 
                      <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format((totalPrintCostPerHour || 0).toFixed(2))}</Label.Detail>
                    </Label>
                  </p>
                  <p>
                    <Label color='teal' style={{margin: 5}}>
                      <Icon name='check circle'/> Total Cost
                      <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(((totalPrintCostPerHour || 0) + (totalPrintCostPerGram || 0)).toFixed(2))}</Label.Detail>
                    </Label>
                  </p>
                </Form>
              </Grid.Column>

              <Grid.Column>
                { /* Markup */}
                <Form style={{paddingTop: 20}}>
                  <Header as='h3' dividing>Markup</Header>
                  <Form.Field>
                    <label>Percentage %</label>
                    <input type="number" placeholder='Energy Consumption per kWh' min={0} value={markup || ''} onChange={(e) => setMarkup(e.target.value)}/>
                    { (totalMarkup || '') && <p style={{margin: 5}}><Label color='teal'>
                          <Icon name='plus'/> Markup
                          <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(totalMarkup.toFixed(2))}</Label.Detail>
                        </Label>
                      </p>
                    }
                  </Form.Field>

                  <Form.Field>
                    <label>Labor Fee (pre and post processing)</label>
                    <input type="number" placeholder='Enter Amount' min={0} value={laborFee || ''} onChange={(e) => setLaborFee(e.target.value)}/>
                  </Form.Field>
                </Form>

                { /* Other Charging Options */}
                <Form style={{paddingTop: 30}}> 
                  <p><Checkbox label='Show other charging options (expenses only)' onChange={(_e, data) => setShowOtherChargingOptions(data.checked)} /></p>
                  { (showOtherChargingOptions || '') &&
                    <Container>
                      <Form.Field>
                        <label>Setup Fee (initial setup)</label>
                        <input type="number" placeholder='Enter Amount' min={0} value={setupFee || ''} onChange={(e) => setSetupFee(e.target.value)}/>
                      </Form.Field>

                      <Form.Field>
                        <label>Packaging</label>
                        <input type="number" placeholder='Enter Amount' min={0} value={packagingFee || ''} onChange={(e) => setPackagingFee(e.target.value)}/>
                      </Form.Field>

                      <Form.Field>
                        <label>Delivery Fee</label>
                        <input type="number" placeholder='Enter Amount' min={0} value={deliveryFee || ''} onChange={(e) => setDeliveryFee(e.target.value)}/>
                      </Form.Field>

                      <Form.Field>
                        <label>Others (glue, pei sheet, etc...)</label>
                        <input type="number" placeholder='Enter Amount' min={0} value={otherFee|| ''} onChange={(e) => setOtherFee(e.target.value)}/>
                      </Form.Field>
                    </Container>
                  }
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        { /* Final Price */}
        <Segment raised style={{marginTop: 50, marginBottom: 100}}>
          <Form>
            <Header as='h3' dividing>Final Price</Header>
            <p>
              <Label color='teal' style={{margin: 5}}>
                <Icon name='check circle'/> Model Cost
                <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(((totalPrintCostPerHour || 0) + (totalPrintCostPerGram || 0)).toFixed(2))}</Label.Detail>
              </Label>
              <Label color='teal' style={{margin: 5}}>
                <Icon name='check circle'/> Other Cost
                <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(totalOtherCost.toFixed(2))}</Label.Detail>
              </Label><br/>
              <Label color='yellow' style={{margin: 5}}>
                <Icon name='check circle'/> Profit (markup + labor fee)
                <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(profit.toFixed(2))}</Label.Detail>
              </Label><br/>
              <Label color='green' style={{margin: 5}}>
                <Icon name='check circle'/> Total
                <Label.Detail>{new Intl.NumberFormat('en', currencyConfig).format(totalCostWithMarkup.toFixed(2))}</Label.Detail>
              </Label>
            </p>
          </Form>
          <Paginator controls={
              <Grid.Column width={16} style={{ marginTop: 10}} textAlign="right">
                <Button.Group>
                  <Button size="small" onClick={() => exportToPDF() } secondary icon>
                    <span className="computer only">Download&nbsp;</span>
                    <Icon name="file pdf"/> 
                  </Button>
                  <Button size="small" onClick={() => setModelInputModalIsVisible(true)} secondary icon style={{opacity: 0.9}}>
                    <Icon name="chevron up"/> 
                  </Button>
                </Button.Group>
                <Button size="small" className="float-left" onClick={() => setActiveStep(3)}>Back</Button>
            </Grid.Column>
          }/>
        </Segment>
      </Container>

      <Modal open={modelInputModalIsVisible}>
      <Modal.Content>
        <Modal.Description>
          <Header>
            <Icon name='cogs' />
            <Header.Content>Configurations</Header.Content>
          </Header>
          <Header as="h4">Model Name</Header>
          <p>
            Please input your preferred model name. This will be used
            as the default filename for the PDF export.<br/>You may leave this blank if you want us to automatically generate it for you.
          </p>
          <Form onSubmit={() => setModelInputModalIsVisible(false)}>
            <Form.Field>
              <input type="text" maxLength={50} placeholder="Model Name: maximum length is 50 characters" onChange={(e) => setModelName(e.target.value)} defaultValue={modelName}/>
            </Form.Field>
          </Form>
          <Header as="h4"><b>Please select your default currency</b></Header>
          <Dropdown inline header='Currency' options={currencyOptions} defaultValue={currency} onChange={(_e, { value }) => {
            setCurrency(value)
          }}/>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button color='black' onClick={() => setModelInputModalIsVisible(false)}>Done</Button>
      </Modal.Actions>
    </Modal>
    </Container>
  )
}

export default Homepage