import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Icon, Menu, Image, Divider, Step, Message, Label, Grid, Button } from 'semantic-ui-react'
import Logo from './assets/img/logo.png'
import bill from './assets/img/bill.png'
import watts from './assets/img/watts.png'
import './index.css'

const Homepage = () => {
  const [activeStep, setActiveStep] : any = useState <number>(0)
  const [filamentWeight, setFilamentWeight] : any = useState <number >(0);
  const [filamentPrice, setFilamentPrice]: any = useState <number | string>(0);
  const [filamentAmount, setFilamentAmount]: any = useState <number | string>(0);
  const [printWeight, setPrintWeight] : any = useState <number | string>(0);
  const [printTimeHours, setPrintTimeHours]: any = useState <number | string>(0);
  const [printTimeMinutes, setPrintTimeMinutes]: any = useState <number | string>(0);
  
  const [powerMonthlyConsumption, setPowerMonthlyConsumption]: any = useState <number | string>(0);
  const [powerMonthlyDue, setPowerMonthlyDue]: any = useState <number | string>(0);
  const [powerConsumptionPerHour, setPowerConsumptionPerHour]: any = useState <number | string>(0);

  const [printerPowerEnergyConsumption, setPrinterPowerEnergyConsumption]: any = useState <number | string>(0);
  const [printerPowerConsumptionPerHour, setPrinterPowerConsumptionPerHour]: any = useState <number | string>(0);

  const [printerRatedPower, setPrinterRatedPower]: any = useState <number | string>(0);

  const [totalPrintTime, setTotalPrintTime]: any = useState <number | string>(0);
  const [totalPrintCostPerGram, setTotalPrintCostPerGram]: any = useState <number | string>(0);
  const [totalPrintCostPerHour, setTotalPrintCostPerHour]: any = useState <number | string>(0);
  const [totalPrintEnergyConsumption, setTotalPrintEnergyConsumption]: any = useState <number | string>(0);


  useEffect (() => {
    let filamentAmountPerGram: number = 0
    // convert filament in kg to g and divide by the acquired cost
    filamentAmountPerGram = parseFloat(filamentPrice || 0) / (parseFloat(filamentWeight || 0) * 1000)
    setFilamentAmount(filamentAmountPerGram)
    // compute total cost per gram
    // total = Filament Price (g) * Print Output Weight(g)
    setTotalPrintCostPerGram (filamentAmountPerGram * parseFloat(printWeight || 0))
  }, [filamentWeight, filamentPrice, printWeight])

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

    // update total energy consumption
    // 9.30693538647343 * 0.35 = 3.2574273852657005
    setTotalPrintEnergyConsumption (newPrinterEnergyConsumption * printerRatedKwh)
    setPrinterPowerEnergyConsumption (newPrinterEnergyConsumption)
    setPrinterPowerConsumptionPerHour (printerRatedKwh)
  }, [printerRatedPower, powerConsumptionPerHour, powerMonthlyConsumption, powerMonthlyDue])

  useEffect (() => {
    // convert minutes to hour
    let totalPrintHours: number = parseFloat(totalPrintTime) / 60
    setTotalPrintCostPerHour(totalPrintEnergyConsumption * totalPrintHours)
  }, [totalPrintTime,totalPrintEnergyConsumption])


  useEffect (() => {
    // convert hours to minutes
    //setTotalPrintTime(parseFloat(printTimeMinutes || 0) + (parseFloat(printTimeHours || 0) * 60))
    let energyConsumption = parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)
    let kWh = parseFloat(powerMonthlyConsumption || 0) / (24 * 30)

    // derive kWh from monthly power consumption (30 days only)
    setPowerConsumptionPerHour (kWh)

    setTotalPrintEnergyConsumption(energyConsumption * kWh)

  }, [powerMonthlyConsumption, powerMonthlyDue])

  const Paginator = (opt:any = {}) => {
    return(
      <Grid style={{marginTop: 20, display: 'none'}} className="visible-xs visible-sm">
        <Grid.Row>
          <Grid.Column width={3} style={{marginTop: 10}}>
            { (typeof opt.backStep !== 'undefined' || '') && <Button size="small" className="float-left" onClick={() => setActiveStep(opt.backStep)}>Back</Button> }
          </Grid.Column>
          <Grid.Column width={10}></Grid.Column>
          <Grid.Column width={3} style={{marginTop: 10}}>
            { (opt.nextStep || '') && <Button size="small" className="float-right" onClick={() => setActiveStep(opt.nextStep)} secondary>Next</Button> }
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return (
    <Container text>
      <Menu secondary style={{padding: '20px'}}>
        <Menu.Menu position='left'>
          <Menu.Item className='hidden-xs logo-section'>
            <Image as='a' href='/' src={Logo} className="logo"/>
          </Menu.Item>
          <Menu.Item>
            <Header as="h1">
              <Header.Content style={{color: '#ff6c00'}}>3D Print Calculator</Header.Content>
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

      <Step.Group ordered unstackable size="mini" className="hidden-xs mainStepper">
        <Step completed={Boolean(filamentAmount)} active={activeStep === 0} onClick={() => setActiveStep(0)}>
          <Step.Content>
            <Step.Title>Filament</Step.Title>
            <Step.Description>Weigh your materials</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintTime) && Boolean(printWeight)} active={activeStep === 1} onClick={() => setActiveStep(1)}>
          <Step.Content>
            <Step.Title>Print Output</Step.Title>
            <Step.Description>Measure your print time</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintEnergyConsumption)} active={activeStep === 2} onClick={() => setActiveStep(2)}>
          <Step.Content>
            <Step.Title>Power Consumption</Step.Title>
            <Step.Description>Estimate your power consumption</Step.Description>
          </Step.Content>
        </Step>

        <Step completed={Boolean(totalPrintCostPerGram) && Boolean(totalPrintCostPerHour)} active={activeStep === 3} onClick={() => setActiveStep(3)}>
          <Step.Content>
            <Step.Title>Results</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>

      <Container style={{display: activeStep === 0 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          <Header as='h3' dividing>
            Filament
            <Header.Subheader>Price and weight of filament used in your print</Header.Subheader>
          </Header>
          <Form.Field>
            <label>Weight (kg)</label>
            <input type="number" placeholder='Kilogram' min={0} value={filamentWeight || ''} onChange={(e) => setFilamentWeight(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Price <b>(PHP)</b></label>
            <input type="number" placeholder='Enter Amount' min={0} value={filamentPrice || ''} onChange={(e) => setFilamentPrice(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <label>Estimated Amount Per Gram <b>(PHP)</b></label>
            <input type="number" placeholder='Total Amount Per Gram' value={filamentAmount || ''}  readOnly disabled/>
          </Form.Field>
        </Form>

        <Paginator nextStep={1}/>
        <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='cube' /></Divider>
      </Container>

      <Container style={{display: activeStep === 1 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          <Header as='h3' dividing>
            Print Output
            <Header.Subheader>Actual print weight and time</Header.Subheader>
          </Header>

          <Form.Field>
            <label>Weight</label>
            <input type="number" placeholder='Grams' value={printWeight || ''} onChange={(e) => setPrintWeight(e.target.value)} min={0}/>
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
          <Paginator nextStep={2} backStep={0}/>
          <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='print' /></Divider>
        </Form>
      </Container>

      <Container style={{display: activeStep === 2 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}>
          <Header as='h3' dividing>
            Power Consumption
            <Header.Subheader>Compute electricity bill for your 3d print</Header.Subheader>
          </Header>

          <Message size='tiny' color='orange'>
            <Message.Header><Icon name='help' /> How to measure my power consumption</Message.Header>
            <p>Please click the "Show Computation" text below for instructions</p>
          </Message>

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

            { ((powerMonthlyConsumption && powerMonthlyDue) || '') && <Message size='tiny' color='green'>
                <p><Icon name='info' />You have a total energy consumption of PHP <u>{(parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)) || ''}</u>/kWh  based on your recent usage (30 Days) with an 
                <em> <Label>hourly</Label> rate of <Label>PHP{((parseFloat (powerMonthlyDue || 0) / parseFloat(powerMonthlyConsumption || 0)) || 0) * (powerConsumptionPerHour || 0) }</Label></em> equivalent to <u>{powerConsumptionPerHour}kWh</u>
                </p><br/>
                <p>Please enter your power supply's wattage to get more acurate results</p>
                <Image as='div' src={watts} width={'100%'} className='bill'/>
                <Form.Field>
                  <label>Printer's Rated Power <span>(Please refer to your power supply's wattage)</span></label>
                  <input type="number" placeholder='Watts' min={0} style={{width: '90%'}} value={printerRatedPower || ''} onChange={(e) => setPrinterRatedPower(e.target.value)}/>
                </Form.Field>
                { ((printerPowerEnergyConsumption && printerRatedPower) || '') && 
                  <p style={{color: 'red'}}>New total energy consumption: PHP<u>{printerPowerEnergyConsumption}</u>/kWh <br/>
                  Estimated hourly consumption: <u>{printerPowerConsumptionPerHour}kW</u></p>
                }
              </Message>
            }
          </details>
          <Form.Field>
            <label>Amount/hour <b>(PHP)</b></label>
            <input type="number" placeholder='Energy Consumption per kWh' min={0} value={totalPrintEnergyConsumption} onChange={(e) => setTotalPrintEnergyConsumption(e.target.value)}/>
          </Form.Field>
        </Form>
        <Paginator nextStep={3} backStep={1}/>
        <Divider style={{marginBottom: 50, marginTop: 50}} horizontal><Icon name='plug' /></Divider>
      </Container>

      <Container style={{display: activeStep === 3 ? 'block': 'none'}}>
        <Form style={{paddingTop: 30}}> 
          <Header as='h3' dividing>Total Cost</Header>
          <p>
            <Label color='teal'>
              <Icon name='cube'/> PHP 
              <Label.Detail>{totalPrintCostPerGram || 0}</Label.Detail>
            </Label>
          </p>
          <p>
            <Label color='teal'>
              <Icon name='coffee'/> Printing Hour Cost: 
              <Label.Detail>PHP {totalPrintCostPerHour || 0}</Label.Detail>
            </Label>
          </p>
          <p>
            <Label color='teal'>
              <Icon name='check circle'/> Total
              <Label.Detail>PHP {((totalPrintCostPerHour || 0) + (totalPrintCostPerGram || 0))}</Label.Detail>
            </Label>
          </p>
        </Form>
        <Paginator backStep={2}/>
      </Container>
    </Container>
  );
}

export default Homepage