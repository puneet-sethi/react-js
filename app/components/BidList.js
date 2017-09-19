import React from "react";
import {render} from "react-dom";
import $ from 'jquery';
import {Count} from "./Count";

export class BidList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      userId: props.userId,
      lastInsertedId: props.lastInsertedId,
      requestSuccess: '0',
      total_count: '',
      dataHtml: null,
      leadsCount: "",
      conversionCount: ""
    }
    this.actionUrlPOST = "http://localhost/reactapi";
    this.afterInsert = this.afterInsert.bind(this);
  }

  afterInsert(){
    this.setState({lastInsertedId: this.props.lastInsertedId});
    alert("mounted");
    console.log(this.state);
  }

  componentDidMount(){
    var data = {
      user_id: this.state.userId
    }
    var self = this;
    // Submit form via jQuery/AJAX
    $.ajax({
      type: 'POST',
      dataType: 'json',       
      url: this.actionUrlPOST + "/bid_list.php",
      data: data,
    }).done(function(response) {
      var dataElem = response.data;
      var dataHtml = dataElem.map((obj) =>
        <tr key={obj.id}>       
           <td> 
             <div  className=""><a href={obj.bid_link} target="_blank">{obj.bid_link}</a></div>
           </td>
           <td> 
             <div  className="">{obj.title}</div>
           </td>          
           <td> 
             <div  className="">{obj.description}</div>
           </td>
           <td> 
             <div  className="">{obj.lead != null ? obj.lead : '--'}</div>
           </td>
           <td> 
             <div  className="">{obj.conversion != null ? obj.conversion : '--'}</div>
           </td>
           <td> 
             <div  className=" ">{obj.created_date}</div>
           </td>
        </tr>
        );
      self.setState({
        dataHtml:dataHtml, 
        requestSuccess: '1', 
        total_count: response.total_count,
        leadsCount: response.leadsCount,
        conversionCount: response.conversionCount
      });
    });
   
  }

  render(){
    var props = {
      bidsCount: this.state.total_count,
      leadsCount: this.state.leadsCount,
      conversionCount: this.state.conversionCount
    };
    console.log(props);
    return (
      <div className="container">
          <div className="justify-content-center">
            <hr></hr>
                <Count {...props}/>
              <hr></hr>
          </div>
          {this.state.requestSuccess === '1' ? <table className="table table-inverse">
            <thead>
              <tr>
                <th>Bid Link</th>
                <th>Title</th>
                <th>Description</th>
                <th>Leads</th>
                <th>Conversions</th>
                <th>Created date</th>
              </tr>
            </thead>
            <tbody>
              {this.state.dataHtml}
            </tbody>
          </table> : null}          
      </div>
      );
  }
}
