import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-newheroe-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewHeroePageComponent implements OnInit{

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
  ){}

  get currentHero(): Hero {
    const hero = this.newHeroForm.value as Hero;
    return hero;
  }

  ngOnInit(): void {
    if( !this.router.url.includes('edit')){
      return;
    }
    this.activatedRoute.params.pipe(
      switchMap( ({id}) => this.heroesService.getHeroById(id))
    ).subscribe( hero => {
      if(!hero) return this.router.navigateByUrl('/');

      this.newHeroForm.reset(hero);
      return;
    });
  }

  public newHeroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', {nonNullable: true}),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl('')
  })

  public publishers = [
    { id: 'DC Comics', desc: 'DC - Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  onSubmit(): void {

    if(this.newHeroForm.invalid) return;

    if(this.currentHero.id){
      this.heroesService.updateHero(this.currentHero).subscribe(hero => {
        //TODO: Mostrar snackbar
        this.showSnackbar(`${hero.superhero} ha sido actualizado`);
      });
      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe( hero=> {
      //TODO: mostrar snackbar, y redirigir a /heroes/edit/hero.id
      this.router.navigate(['/heroes/edit', hero.id]);
      this.showSnackbar(`${hero.superhero} ha sido creado`);
    })
  }

  onDeleteHero(): void {
    if( !this.currentHero.id ) throw Error('Hero id es requerido');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: this.newHeroForm.value
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log({result});
    });

  }

  showSnackbar( message: string ): void{
    this.snackbar.open( message, 'done', {
      duration: 2500,
    })
  }
}
