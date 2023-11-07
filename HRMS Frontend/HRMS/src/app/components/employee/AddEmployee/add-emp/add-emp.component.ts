import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeservicesService } from './../../../../services/employeeservices.service';
import { ActivatedRoute, Router } from '@angular/router';
import { empAge, hireDate } from 'src/app/validators/EmployeeValidators';
import { IEmployee } from 'src/app/models/iemployee';

@Component({
  selector: 'app-add-emp',
  templateUrl: './add-emp.component.html',
  styleUrls: ['./add-emp.component.css'],
})
export class AddEmpComponent implements OnInit {
  empval: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private employeeServices: EmployeeservicesService,private router:Router,
              private route: ActivatedRoute) {
    this.empval = this.fb.group({
      firstName: new FormControl ('', Validators.required),
      lastName: new FormControl ('', Validators.required),
      address: new FormControl ('', Validators.required),
      phone: new FormControl ('', [Validators.required, Validators.pattern("^[0-9]{11}$")]),
      gender: new FormControl ('', Validators.required),
      nationality: new FormControl ('', Validators.required),
      nationalId: new FormControl ('', [Validators.required,Validators.pattern("^[0-9]{14}$")]),
      salary: new FormControl ('', [Validators.required]),
      birthDate: new FormControl ('', [Validators.required,empAge()]),
      hireDate: new FormControl ('', [Validators.required,hireDate()]),
      arrivalTime: new FormControl ('', Validators.required),
      leaveTime: new FormControl ('', Validators.required)
    });
  }
  ngOnInit(): void {
    if(parseInt(this.route.snapshot.url[1].path)!=0){
      this.employeeServices.GetEmployee(parseInt(this.route.snapshot.url[1].path)).subscribe({
        next: (response:any) => {
          let emp:IEmployee=response;
          this.empval.get("firstName")?.setValue(emp.firstName)
          this.empval.get("lastName")?.setValue(emp.lastName)
          this.empval.get("address")?.setValue(emp.address)
          this.empval.get("phone")?.setValue(emp.phone)
          this.empval.get("gender")?.setValue(emp.gender)
          this.empval.get("nationality")?.setValue(emp.nationality)
          this.empval.get("nationalId")?.setValue(emp.nationalId)
          this.empval.get("salary")?.setValue(emp.salary)
          this.empval.get("birthDate")?.setValue(emp.birthDate.toString().split("T")[0])
          this.empval.get("hireDate")?.setValue(emp.hireDate.toString().split("T")[0])
          this.empval.get("arrivalTime")?.setValue(emp.arrivalTime.toString().split("T")[1])
          this.empval.get("leaveTime")?.setValue(emp.leaveTime.toString().split("T")[1])          
        },
        error: () => {
          console.error();
          window.alert('Error in getting employee for editing');
        }
      });
    }
    
  }

  onsubmitform() {
    this.submitted = true;

    if (this.empval.valid) {
      const formData = this.empval.value;

      const dates = {
        birthDate: formData.birthDate,
        hireDate: formData.hireDate,
        arrivalTime: formData.arrivalTime,
        leaveTime: formData.leaveTime,
      };
      
      const arrivalTime = this.convertTimeToDate(dates.arrivalTime);
      const leaveTime = this.convertTimeToDate(dates.leaveTime);
      
      const employeeData:IEmployee = { ...formData, arrivalTime, leaveTime,id:this.route.snapshot.url[1].path };

      console.log(employeeData);
      

      if(parseInt(this.route.snapshot.url[1].path)!=0){
        this.employeeServices.editEmployee(employeeData).subscribe({
          next: () => {
            window.alert('Successfully edited');
            this.router.navigate(['/employee']);
          },
          error: () => {
            console.error();
            window.alert('Error in editing');
          }
        });
      }
      else{
        this.employeeServices.AddEmployee(employeeData).subscribe({
          next: () => {
            window.alert('Successfully added');
            this.router.navigate(['/employee']);
          },
          error: () => {
            console.error();
            window.alert('Error in adding');
          }
        });
      }
    } 
    else {
      window.alert('Please fill out all required fields and correct any validation errors.');
    }
  }

  convertTimeToDate(time: any): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setUTCHours(hours);
    date.setUTCMinutes(minutes);
    return date;
  }

}